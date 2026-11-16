import { Trash2Icon } from "lucide-react";
import { type ComponentProps, useState } from "react";
import { formattedDate } from "@/lib/date";
import { deleteTodo } from "@/lib/db/delete";
import { handleError } from "@/lib/error";
import type { TodoInFront } from "@/lib/todo/types";
import { setTodoList, useTodo } from "@/store/todo";
import { MakeAlertDialog } from "../dialog/MakeAlertDialog";
import { Button } from "../ui/button";

export default function DeleteTodo({ todo }: { todo: TodoInFront }) {
	const [open, setOpen] = useState(false);
	const deleteHandler = async () => {
		try {
			await deleteTodo(todo.id.toString());
			setTodoList(
				useTodo.getState().todoList?.filter((t) => t.id !== todo.id) ?? [],
			);
			setOpen(false);
		} catch (error) {
			handleError(error);
		}
	};
	const props: ComponentProps<typeof MakeAlertDialog> = {
		title: "할 일 삭제",
		description: `[${formattedDate(todo.dueDate)} ${todo.content}]\n 위 할 일을 삭제하시겠습니까?`,
		actionLabel: "삭제",
		actionVariant: "destructive",
		clickHandler: deleteHandler,
		open,
		setOpen,
		children: (
			<Button variant="ghost">
				<Trash2Icon size={15} color="red" />
			</Button>
		),
	};
	return <MakeAlertDialog {...props}></MakeAlertDialog>;
}
