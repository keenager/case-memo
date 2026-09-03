import "@/components/section-detail/editor/styles.css";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { debounce } from "@/lib/debounce";
import { MenuBar } from "./MenuBar";
import { isEmpty, saveMemo } from "./utils";

export default function MemoEditor() {
	const debouncedSave = useRef(
		debounce(() => {
			console.log("업데이트!!!");
		}, 1500),
	).current;

	const editor = useEditor({
		extensions: [StarterKit],
		content: content,
		editorProps: {
			attributes: { class: "prose prose-sm max-w-none focus:outline-none" },
		},
		onUpdate: ({ editor }) => {
			const currentContents = editor.getJSON();
			if (isEmpty(currentContents)) return;
			debouncedSave();
		},
	});

	const clickHandler = () => {
		saveMemo(editor.getJSON());
	};
	return (
		<div>
			<MenuBar editor={editor} />
			<Button onClick={clickHandler}>저장</Button>
			<EditorContent editor={editor} className="flex-1" />
			<FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
			<BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
		</div>
	);
}

const content = "Hello!";
// `<h2>
//   Hi there,
// </h2>
// <p>
//   this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:
// </p>
// <ul>
//   <li>
//     That's a bullet list with one …
//   </li>
//   <li>
//     … or two list items.
//   </li>
// </ul>
// <p>
//   Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:
// </p>
// <pre><code class="language-css">body {
//   display: none;
// }</code></pre>
// <p>
//   I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
// </p>
// <blockquote>
//   Wow, that's amazing. Good work, boy! 👏
//   <br />
//   — Mom
// </blockquote>
// `;
