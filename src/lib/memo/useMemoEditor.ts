import type { Editor } from "@tiptap/core";
import { useEffect, useRef, useState } from "react";
import { debounce } from "@/lib/memo/debounce";
import { useFlow } from "@/store/diagram";
import { saveMemo } from "./save";
import type { ArgsForEditor } from "./types";

export const useMemoEditor = ({
	editor,
	props,
}: {
	editor: Editor;
	props: ArgsForEditor;
}) => {
	const flowNodes = useFlow((state) => state.currentFlowNodes);
	const [showNoti, setShowNoti] = useState(false);
	const { caseId, sectionCategory } = props;

	const toggleNoti = () => {
		setShowNoti(true);
		setTimeout(() => {
			setShowNoti(false);
		}, 2000);
	};

	const saveHandler = async () => {
		try {
			if (sectionCategory === "hearings") {
				if (!props.hearingId) {
					console.error("Hearing ID is required for hearings section");
					return;
				}
				await saveMemo({
					caseId,
					sectionCategory,
					hearingId: props.hearingId,
					contents: editor.getJSON(),
				});
				toggleNoti();
			} else {
				await saveMemo({
					caseId,
					sectionCategory,
					contents: editor.getJSON(),
				});
				toggleNoti();
			}
		} catch (error) {
			console.error(error);
		}
	};

	const debouncedSave = useRef(
		debounce(async () => {
			await saveHandler();
			console.log("업데이트!!!");
		}, 1500),
	).current;
	// console.log("MemoEditor contents:", contents);

	useEffect(() => {
		if (!editor) return;

		// flownode로 설정된 문단에 하이라이트 표시
		flowNodes.forEach((fn) => {
			let startPos = 0,
				endPos = 0;

			editor.state.doc.descendants((node, pos) => {
				if (node.attrs.id === fn.paraId) {
					startPos = pos + 1;
					endPos = pos + node.nodeSize - 1;
					editor
						.chain()
						.setTextSelection({ from: startPos, to: endPos })
						.setHighlight({ color: "#fff3bf" })
						.blur()
						.run();
					return false;
				}
				return true;
			});
		});
		// editor.commands.focus("start");

		// console.log("MemoEditor contents changed:", contents);
	}, [editor, flowNodes]);

	return { showNoti, debouncedSave };
};
