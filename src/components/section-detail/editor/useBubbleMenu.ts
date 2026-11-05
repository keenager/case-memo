import type { QueryResult } from "@tauri-apps/plugin-sql";
import type { Editor } from "@tiptap/core";
import { type SubmitEvent, useState } from "react";
import { getDB } from "@/lib/db/db";
import type { FlowNode, FlowNodeWithContent } from "@/lib/diagram/types";
import { handleError } from "@/lib/error";
import { useFlow } from "@/store/diagram";
import { useMemo } from "@/store/memo";

export const useBubbleMenu = ({ editor }: { editor: Editor }) => {
	const currentMemoId = useMemo((state) => state.currentMemoId);
	const addNode = useFlow((state) => state.addNewFlowNode);

	const [isUpdate, setIsUpdate] = useState(false);
	const initNode: FlowNode = {
		id: 0,
		party: "plaintiff",
		category: "relief",
		memoId: 0,
		paraId: "",
	};
	const [selectedNode, setSelectedNode] = useState<FlowNode>(initNode);

	const showHandler = async () => {
		const { $anchor } = editor.state.selection;
		const paraId = $anchor.node().attrs.id as string;
		try {
			const db = await getDB();
			const [result] = (await db.select(
				`SELECT * FROM flow_nodes WHERE memo_id = $1 AND para_id = $2`,
				[currentMemoId, paraId],
			)) as FlowNode[];
			if (result) {
				setIsUpdate(true);
				setSelectedNode(result);
			} else {
				setIsUpdate(false);
			}
		} catch (error) {
			handleError(error);
		}
	};

	const submitHandler = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const node = editor.state.selection.$anchor.node();
		const nodeName = node.type.name;
		// editor.getAttributes()는 현재 선택된 노드를 대상으로 함.
		const paraId = editor.getAttributes(nodeName).id;
		// console.log({ currentMemoId, paraId, party, category, parentId });

		const { party, category, parentId } = selectedNode;

		try {
			let result: QueryResult;
			const db = await getDB();
			if (isUpdate) {
				result = await db.execute(
					`UPDATE flow_nodes 
                    SET party = $1, category = $2, parent_id = $3
                    WHERE memo_id = $4 AND para_id = $5`,
					[party, category, parentId, currentMemoId, paraId],
				);
			} else {
				result = await db.execute(
					`
                    INSERT INTO flow_nodes (memo_id, para_id, party, category, parent_id) VALUES ($1, $2, $3, $4, $5)
                    `,
					[currentMemoId, paraId, party, category, parentId],
				);
			}
			console.log(result);
			const newFlowNode: FlowNodeWithContent = {
				id: isUpdate ? 0 : (result.lastInsertId ?? 0),
				memoId: currentMemoId ?? 0,
				paraId,
				party,
				category,
				parentId,
				content: node.textContent,
			};
			addNode(newFlowNode);

			// 메뉴 감추기
			editor.commands.setTextSelection(editor.state.selection.to);
		} catch (error) {
			handleError(error);
		}
	};

	return {
		isUpdate,
		initNode,
		selectedNode,
		setSelectedNode,
		showHandler,
		submitHandler,
	};
};
