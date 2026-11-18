import type { Editor } from "@tiptap/core";
import { DatePickField } from "@/components/dialog/fields/DatePickField";
import TextField from "@/components/dialog/fields/TextField";
import MakeDialog from "@/components/dialog/MakeDialog";
import { useTodoDialog } from "@/lib/todo/useTodoDialog";
import { MenuItem } from "../../../ui/bubble-menu";

export default function TodoWriteDiaglog({
	editor,
	targetTodoId,
}: {
	editor: Editor;
	targetTodoId: string | undefined;
}) {
	const { open, setOpen, form, onSubmit } = useTodoDialog(editor, targetTodoId);
	const title = targetTodoId ? "할 일 수정" : "할 일 추가";

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
			<MenuItem
				text={targetTodoId ? "할 일 수정" : "할 일 추가"}
				clickHandler={() => {
					setOpen(true);
				}}
			/>
			<DatePickField
				fieldInfo={{ name: "dueDate", label: "날짜" }}
				form={form}
			/>
			<TextField fieldInfo={{ name: "content", label: "내용" }} form={form} />
		</MakeDialog>
	);
}
