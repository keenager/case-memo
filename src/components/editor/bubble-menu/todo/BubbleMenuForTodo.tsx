import type { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react/menus";
import { useState } from "react";
import TodoWriteDiaglog from "@/components/editor/bubble-menu/todo/TodoWriteDialog";
import {
	MenuItem,
	MenuLabel,
	MenuSeparator,
	MenuWrapper,
} from "@/components/ui/bubble-menu";
import { useTodo } from "@/store/todo";
import TodoDeleteDialog from "./TodoDeleteDialog";

export default function BubbleMenuForTodo({ editor }: { editor: Editor }) {
	const [targetTodoId, setTargetTodoId] = useState<string | undefined>(
		undefined,
	);

	return (
		<BubbleMenu
			editor={editor}
			options={{
				placement: "right-start",
				onShow() {
					const todoId = editor.getAttributes("todoHighlight").todoId as
						| string
						| undefined;
					console.log("todoId: ", todoId);
					console.log("todoList: ", useTodo.getState().todoList);
					setTargetTodoId(todoId);
				},
			}}
		>
			<MenuWrapper>
				<MenuLabel>할 일 관리</MenuLabel>
				<TodoWriteDiaglog
					editor={editor}
					targetTodoId={targetTodoId}
				></TodoWriteDiaglog>
				{targetTodoId && (
					<TodoDeleteDialog editor={editor} targetTodoId={targetTodoId} />
				)}

				<MenuSeparator />

				<MenuLabel>레이블 2</MenuLabel>
				<MenuItem text="다른 메뉴 1" />
				<MenuItem text="다른 메뉴 2" />
				<MenuItem text="다른 메뉴 3" />
			</MenuWrapper>
		</BubbleMenu>
	);
}
