import type { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react/menus";
import { useState } from "react";
import TodoDiaglog from "@/components/dialog/TodoDialog";
import { Button } from "@/components/ui/button";
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

			await deleteTodo(todoId);

			const newList = useTodo
				.getState()
				.todoList.filter((t) => t.id.toString() !== todoId);
			setTodoList(newList);

			editor
				.chain()
				.focus()
				.extendMarkRange("todoHighlight")
				.unsetTodoHighlight()
				.setTextSelection(editor.state.selection.to)
				.run();
		} catch (error) {
			handleError(error);
		}
	};
	return (
		<BubbleMenu
			editor={editor}
			className="border rounded-md bg-white"
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
			<div className="flex flex-col">
				<TodoDiaglog editor={editor} existingTodoId={existingTodoId} />
				{existingTodoId && (
					<Button
						onClick={deleteHandler.bind(
							null,
							editor.getAttributes("todoHighlight").todoId as
								| string
								| undefined,
						)}
					>
						할일 삭제
					</Button>
				)}
				<div>다른 메뉴 1</div>
				<div>다른 메뉴 2</div>
				<div>다른 메뉴 3</div>
			</div>
		</BubbleMenu>
	);
}
