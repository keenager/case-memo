import "@/components/section-detail/editor/styles.css";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { debounce } from "@/lib/debounce";
import type { ArgsForEditor } from "@/lib/memo";
import { MenuBar } from "./MenuBar";
import { isEmpty, saveMemo } from "./utils";

export default function MemoEditor(props: ArgsForEditor) {
	const { caseId, sectionCategory, contents } = props;
	//TODO: 자동저장 기능 구현하기
	const debouncedSave = useRef(
		debounce(() => {
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

	const clickHandler = () => {
		if (sectionCategory === "hearings") {
			if (!props.hearingId) {
				console.error("Hearing ID is required for hearings section");
				return;
			}
			saveMemo({
				caseId,
				sectionCategory,
				hearingId: props.hearingId,
				contents: editor.getJSON(),
			});
		} else {
			saveMemo({
				caseId,
				sectionCategory,
				contents: editor.getJSON(),
			});
		}
	};

	return (
		<>
			<MenuBar editor={editor} />
			<div>
				<Button onClick={clickHandler}>저장</Button>
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
