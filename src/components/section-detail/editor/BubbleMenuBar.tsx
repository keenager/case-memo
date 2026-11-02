import type { QueryResult } from "@tauri-apps/plugin-sql";
import type { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react/menus";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { getDB } from "@/lib/db/db";
import {
	CLAIM_CATEGORIES,
	type ClaimCategory,
	type FlowNode,
	type FlowNodeWithContent,
	PARTIES,
	type Party,
} from "@/lib/diagram/types";
import { handleError } from "@/lib/error";
import { useFlow } from "@/store/diagram";
import { useMemo } from "@/store/memo";

export default function BubbleMenuBar({ editor }: { editor: Editor }) {
	const currentMemoId = useMemo((state) => state.currentMemoId);
	// const currentFlowNodes = useFlow((state) => state.currentFlowNodes);
	const currentFlowNodesWithContents = useFlow(
		(state) => state.currentFlowNodesWithContents,
	);

	const [isUpdate, setIsUpdate] = useState(false);
	const [party, setParty] = useState<Party>(PARTIES[0].value);
	const [category, setCategory] = useState<ClaimCategory>(
		CLAIM_CATEGORIES[0].value,
	);
	const [parentId, setParentId] = useState<number | undefined>();
	console.log("parentId: ", parentId);

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
				setParty(result.party);
				setCategory(result.category);
				setParentId(result.parent);
			} else {
				setIsUpdate(false);
			}
		} catch (error) {
			handleError(error);
		}
	};

	const hideHandler = () => {
		setParty(PARTIES[0].value);
		setCategory(CLAIM_CATEGORIES[0].value);
		setParentId(undefined);
	};

	const submitHandler = async (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const nodeName = editor.state.selection.$anchor.node().type.name;
		// editor.getAttributes()는 현재 선택된 노드를 대상으로 함.
		const paraId = editor.getAttributes(nodeName).id;
		console.log({ currentMemoId, paraId, party, category, parentId });

		try {
			let result: QueryResult;
			const db = await getDB();
			if (isUpdate) {
				result = await db.execute(
					`UPDATE flow_nodes 
                    SET party = $1, category = $2, parent = $3
                    WHERE memo_id = $4 AND para_id = $5`,
					[party, category, parentId, currentMemoId, paraId],
				);
			} else {
				result = await db.execute(
					`
                    INSERT INTO flow_nodes (memo_id, para_id, party, category, parent) VALUES ($1, $2, $3, $4, $5)
                    `,
					[currentMemoId, paraId, party, category, parentId],
				);
			}
			console.log(result);

			// 메뉴 감추기
			editor.commands.setTextSelection(editor.state.selection.to);
		} catch (error) {
			handleError(error);
		}
	};
	return (
		<BubbleMenu
			editor={editor}
			className="border rounded-md bg-white"
			options={{ placement: "right", onShow: showHandler, onHide: hideHandler }}
		>
			<form className="flex flex-col" onSubmit={submitHandler}>
				<div className="mt-2 mx-2 flex gap-3">
					<FieldSet>
						<FieldLegend>당사자</FieldLegend>
						<Separator />
						<RadioGroup value={party} onValueChange={setParty}>
							{PARTIES.map((party) => (
								<Field key={party.id} orientation="horizontal">
									<RadioGroupItem value={party.value} id={party.id} />
									<FieldLabel htmlFor={party.id}>{party.label}</FieldLabel>
								</Field>
							))}
						</RadioGroup>
					</FieldSet>
					<Separator orientation="vertical" />
					<FieldSet>
						<FieldLegend>주장의 종류</FieldLegend>
						<Separator />
						<RadioGroup value={category} onValueChange={setCategory}>
							{CLAIM_CATEGORIES.map((cate) => (
								<Field key={cate.id} orientation="horizontal">
									<RadioGroupItem value={cate.value} id={cate.id} />
									<FieldLabel htmlFor={cate.id}>{cate.label}</FieldLabel>
								</Field>
							))}
						</RadioGroup>
					</FieldSet>
					{(category === "ground" || category === "element") && (
						<>
							<Separator orientation="vertical" />
							<Additional
								category={category}
								parentList={currentFlowNodesWithContents.filter(
									(n) =>
										n.category ===
										(category === "ground" ? "relief" : "ground"),
								)}
								parentId={parentId}
								setParentId={setParentId}
							/>
						</>
					)}
				</div>
				<Separator />
				<div className="flex justify-center">
					<Button className="my-1" type="submit">
						{isUpdate ? "수정" : "만들기"}
					</Button>
				</div>
			</form>
		</BubbleMenu>
	);
}

const Additional = ({
	category,
	parentList,
	parentId,
	setParentId,
}: {
	category: "ground" | "element";
	parentList: FlowNodeWithContent[];
	parentId: number | undefined;
	setParentId: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => (
	<FieldSet>
		<FieldLegend>
			소속 {category === "ground" ? "청구취지" : "청구원인"}
		</FieldLegend>
		<Separator />
		<RadioGroup value={parentId} onValueChange={setParentId}>
			{parentList.map((parent) => (
				<Field key={parent.id} orientation="horizontal">
					<RadioGroupItem value={parent.id} id={parent.id.toString()} />
					<FieldLabel htmlFor={parent.id.toString()}>
						{parent.content}
					</FieldLabel>
				</Field>
			))}
		</RadioGroup>
	</FieldSet>
);
