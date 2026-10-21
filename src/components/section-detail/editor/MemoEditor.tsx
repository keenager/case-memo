import "@/components/section-detail/editor/styles.css";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { debounce } from "@/lib/memo/debounce";
import type { ArgsForEditor } from "@/lib/memo/types";
import { isEmpty, saveMemo } from "../../../lib/memo/save";
import { MenuBar } from "./MenuBar";

export default function MemoEditor(props: ArgsForEditor) {
	const { caseId, sectionCategory, contents } = props;

	const [showNoti, setShowNoti] = useState(false);
	const toggleNoti = () => {
		setShowNoti(true);
		setTimeout(() => {
			setShowNoti(false);
		}, 2000);
	};

	const debouncedSave = useRef(
		debounce(async () => {
			await saveHandler();
			console.log("업데이트!!!");
		}, 1500),
	).current;
	// console.log("MemoEditor contents:", contents);

	const editor = useEditor({
		extensions: [StarterKit],
		content: contents ? JSON.parse(contents) : "",
		editorProps: {
			attributes: { class: "prose prose-sm max-w-none focus:outline-none" },
		},
		onUpdate: ({ editor }) => {
			const currentContents = editor.getJSON();
			if (isEmpty(currentContents)) return;
			debouncedSave();
		},
	});
	useEffect(() => {
		console.log("MemoEditor contents changed:", contents);
	}, [contents]);

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

	return (
		<>
			<MenuBar editor={editor} />
			<div className="flex gap-3">
				{showNoti && (
					<div className="flex items-center gap-2">
						<Check color="green" size={15} />
						<span className="text-sm">저장 완료</span>
					</div>
				)}
				{/* <Button onClick={saveHandler}>저장</Button> */}
			</div>
			<EditorContent editor={editor} className="flex-1 border rounded-md p-1" />
			<FloatingMenu editor={editor} className="border">
				This is the floating menu
			</FloatingMenu>
			<BubbleMenu editor={editor} className="border">
				This is the bubble menu
			</BubbleMenu>
		</>
	);
}
