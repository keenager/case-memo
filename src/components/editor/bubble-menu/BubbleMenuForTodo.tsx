import type { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react/menus";
import { useState } from "react";
import TodoDiaglog from "@/components/dialog/TodoDialog";
import {
	MenuItem,
	MenuLabel,
	MenuSeparator,
	MenuWrapper,
} from "@/components/ui/bubble-menu";
import { deleteTodo } from "@/lib/db/delete";
import { handleError } from "@/lib/error";
import { setTodoList, useTodo } from "@/store/todo";

export default function BubbleMenuForTodo({ editor }: { editor: Editor }) {
	const [existingTodoId, setExistingTodoId] = useState<string | undefined>(
		undefined,
	);

	const deleteHandler = async (todoId: string | undefined) => {
		try {
			if (!todoId) throw new Error(`잘못된 todoId${todoId} 입니다.`);

			await deleteTodo(Number(todoId));

			const newList = useTodo
				.getState()
				.todoList?.filter((t) => t.id.toString() !== todoId);
			setTodoList(newList ?? []);

			editor
				.chain()
				.focus()
				.extendMarkRange("todoHighlight")
				.unsetTodoHighlight()
				.toggleTaskList()
				.setTextSelection(editor.state.selection.to)
				.run();
		} catch (error) {
			handleError(error);
		}
	};

	return (
		<BubbleMenu
			editor={editor}
			options={{
				placement: "right-start",
				onShow() {
					const todoId = editor.getAttributes("todoHighlight").todoId as
						| string
						| undefined;
					setExistingTodoId(todoId);
				},
			}}
		>
			<MenuWrapper>
				<MenuLabel>할 일 관리</MenuLabel>
				<TodoDiaglog
					editor={editor}
					existingTodoId={existingTodoId}
				></TodoDiaglog>
				{existingTodoId && (
					<MenuItem
						text="할 일 삭제"
						clickHandler={() => {
							deleteHandler(existingTodoId);
						}}
					/>
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
