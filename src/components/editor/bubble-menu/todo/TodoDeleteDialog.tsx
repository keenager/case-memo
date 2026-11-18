import type { Editor } from "@tiptap/core";
import { useState } from "react";
import { MakeAlertDialog } from "@/components/dialog/MakeAlertDialog";
import { MenuItem } from "@/components/ui/bubble-menu";
import { formattedDate } from "@/lib/date";
import { deleteTodo } from "@/lib/db/delete";
import { handleError } from "@/lib/error";
import { setTodoList, useTodo } from "@/store/todo";

//TODO: DeleteTodo.tsx와 합치기 고려
export default function TodoDeleteDialog({
	editor,
	targetTodoId,
}: {
	editor: Editor;
	targetTodoId: string;
}) {
	const [open, setOpen] = useState(false);
	const title = "할 일 삭제";
	const todo = useTodo((s) => s.todoList)?.find(
		(t) => t.id === Number(targetTodoId),
	);
	const description = todo
		? `${todo.content}(${formattedDate(todo.dueDate)})를 삭제하시겠습니까?`
		: "선택된 아이템이 없거나 잘못된 정보입니다.";
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

			setOpen(false);
		} catch (error) {
			handleError(error);
		}
	};

	return (
		<MakeAlertDialog
			open={open}
			setOpen={setOpen}
			title={title}
			description={description}
			actionLabel="삭제"
			actionVariant="destructive"
			actionDisabled={!todo}
			clickHandler={
				todo ? deleteHandler.bind(null, targetTodoId) : async () => {}
			}
		>
			<MenuItem
				text={title}
				clickHandler={() => {
					setOpen(true);
				}}
			/>
		</MakeAlertDialog>
	);
}
