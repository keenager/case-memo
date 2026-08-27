import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import {
	Bold,
	Code,
	CornerDownLeft,
	Eraser,
	Heading1,
	Heading2,
	Heading3,
	Heading4,
	Heading5,
	Heading6,
	Italic,
	List,
	ListOrdered,
	Minus,
	Pilcrow,
	Quote,
	Redo2,
	RemoveFormatting,
	SquareCode,
	Strikethrough,
	Undo2,
} from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { menuBarStateSelector } from "./menuBarState";

export function MenuBar({ editor }: { editor: Editor }) {
	const editorState = useEditorState({
		editor,
		selector: menuBarStateSelector,
	});

	if (!editor) {
		return null;
	}

	return (
		<div className="flex flex-wrap">
			<ButtonGroup>
				<Button
					variant={editorState.isBold ? "default" : "outline"}
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={!editorState.canBold}
				>
					<Bold />
				</Button>
				<Button
					variant={editorState.isItalic ? "default" : "outline"}
					onClick={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editorState.canItalic}
				>
					<Italic />
				</Button>
				<Button
					variant={editorState.isStrike ? "default" : "outline"}
					onClick={() => editor.chain().focus().toggleStrike().run()}
					disabled={!editorState.canStrike}
				>
					<Strikethrough />
				</Button>
				<Button
					variant={editorState.isCode ? "default" : "outline"}
					onClick={() => editor.chain().focus().toggleCode().run()}
					disabled={!editorState.canCode}
				>
					<Code />
				</Button>
				<Button
					variant="outline"
					onClick={() => editor.chain().focus().unsetAllMarks().run()}
				>
					<RemoveFormatting />
				</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button
					variant={editorState.isParagraph ? "default" : "outline"}
					onClick={() => editor.chain().focus().setParagraph().run()}
				>
					<Pilcrow />
				</Button>
				<Button
					variant={editorState.isHeading1 ? "default" : "outline"}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
				>
					<Heading1 />
				</Button>
				<Button
					variant={editorState.isHeading2 ? "default" : "outline"}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
				>
					<Heading2 />
				</Button>
				<Button
					variant={editorState.isHeading3 ? "default" : "outline"}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
				>
					<Heading3 />
				</Button>
				<Button
					variant={editorState.isHeading4 ? "default" : "outline"}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 4 }).run()
					}
				>
					<Heading4 />
				</Button>
				<Button
					variant={editorState.isHeading5 ? "default" : "outline"}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 5 }).run()
					}
				>
					<Heading5 />
				</Button>
				<Button
					variant={editorState.isHeading6 ? "default" : "outline"}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 6 }).run()
					}
				>
					<Heading6 />
				</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button
					variant={editorState.isBulletList ? "default" : "outline"}
					onClick={() => editor.chain().focus().toggleBulletList().run()}
				>
					<List />
				</Button>
				<Button
					variant={editorState.isOrderedList ? "default" : "outline"}
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
				>
					<ListOrdered />
				</Button>
				<Button
					variant={editorState.isCodeBlock ? "default" : "outline"}
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
				>
					<SquareCode />
				</Button>
				<Button
					variant={editorState.isBlockquote ? "default" : "outline"}
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
				>
					<Quote />
				</Button>
				<Button
					variant="outline"
					onClick={() => editor.chain().focus().setHorizontalRule().run()}
				>
					<Minus />
				</Button>
				<Button
					variant="outline"
					onClick={() => editor.chain().focus().setHardBreak().run()}
				>
					<CornerDownLeft />
				</Button>
				<Button
					variant="outline"
					onClick={() => editor.chain().focus().clearNodes().run()}
				>
					{/* Clear nodes */}
					<Eraser />
				</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button
					variant={editorState.canUndo ? "default" : "outline"}
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editorState.canUndo}
				>
					<Undo2 />
				</Button>
				<Button
					variant={editorState.canRedo ? "default" : "outline"}
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editorState.canRedo}
				>
					<Redo2 />
				</Button>
			</ButtonGroup>
		</div>
	);
}
