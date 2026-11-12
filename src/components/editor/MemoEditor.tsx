import Highlight from "@tiptap/extension-highlight";
import UniqueID from "@tiptap/extension-unique-id";
import { EditorContent, useEditor } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { Check } from "lucide-react";
import { isEmpty } from "@/lib/memo/save";
import type { ArgsForEditor } from "@/lib/memo/types";
import { useMemoEditor } from "@/lib/memo/useMemoEditor";
import BubbleMenuForDiagram from "./bubble-menu/BubbleMenuForDiagram";
import BubbleMenuForTodo from "./bubble-menu/BubbleMenuForTodo";
import { MenuBar } from "./menu-bar/MenuBar";
import "./styles.css";
import "./editor.css";
import { TodoHighlight } from "./custom-extensions/TodoHighlight";

export default function MemoEditor(props: ArgsForEditor) {
	const { sectionCategory, contents } = props;

	const editor = useEditor({
		extensions: [
			StarterKit,
			Highlight.configure({ multicolor: true }),
			TodoHighlight,
			UniqueID.configure({ types: ["heading", "paragraph"] }),
		],
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

	const { showNoti, debouncedSave } = useMemoEditor({ editor, props });

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
			{sectionCategory === "arguments-summary" ? (
				<BubbleMenuForDiagram editor={editor} />
			) : (
				<BubbleMenuForTodo editor={editor} />
			)}
		</>
	);
}
