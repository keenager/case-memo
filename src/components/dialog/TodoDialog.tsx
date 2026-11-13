import type { Editor } from "@tiptap/core";
import { DatePickField } from "@/components/dialog/fields/DatePickField";
import TextField from "@/components/dialog/fields/TextField";
import MakeDialog from "@/components/dialog/MakeDialog";
import { useBubbleForTodo } from "../editor/bubble-menu/useBubbleForTodo";
import { Button } from "../ui/button";

export default function TodoDiaglog({
	editor,
	existingTodoId,
}: {
	editor: Editor;
	existingTodoId: string | undefined;
}) {
	const { open, setOpen, form, onSubmit } = useBubbleForTodo(
		editor,
		existingTodoId,
	);
	const title = existingTodoId ? "할 일 수정" : "할 일 추가";

	const props = {
		title,
		onSubmit: form.handleSubmit(onSubmit, (err) => {
			console.log(err);
		}),
		open,
		setOpen,
	};

	return (
		<MakeDialog {...props}>
			<Button>{title}</Button>
			<DatePickField
				fieldInfo={{ name: "dueDate", label: "날짜" }}
				form={form}
			/>
			<TextField fieldInfo={{ name: "content", label: "내용" }} form={form} />
		</MakeDialog>
	);
}
