import "@/components/section-detail/editor/styles.css";
import { useParams } from "@tanstack/react-router";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { debounce } from "@/lib/debounce";
import type { SectionCategory } from "@/lib/sections";
import { MenuBar } from "./MenuBar";
import { isEmpty, saveMemo } from "./utils";

export type MemoEditorProps = {
	sectionCategory: SectionCategory;
	hearingId?: string;
	contents: string | undefined;
};

export default function MemoEditor({
	sectionCategory,
	hearingId,
	contents,
}: MemoEditorProps) {
	const { caseNumber } = useParams({ from: "/$caseNumber" });

	//TODO: 자동저장 기능 구현하기
	const debouncedSave = useRef(
		debounce(() => {
			console.log("업데이트!!!");
		}, 1500),
	).current;
	console.log("MemoEditor contents:", contents);
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
		//TODO: 기일 진행 부분 저장 관련해서 손보기.

		if (sectionCategory === "hearings") {
			if (!hearingId) {
				console.error("Hearing ID is required for hearings section");
				return;
			}

			saveMemo({
				caseNumber,
				sectionCategory,
				hearingId,
				contents: editor.getJSON(),
			});
		} else {
			saveMemo({
				caseNumber,
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

// const content = "Hello!";
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
