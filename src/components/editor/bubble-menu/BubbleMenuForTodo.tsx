import type { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react/menus";
import { DatePickField } from "@/components/dialog/fields/DatePickField";
import TextField from "@/components/dialog/fields/TextField";
import MakeDialog from "@/components/dialog/MakeDialog";
import { Button } from "@/components/ui/button";
import { useBubbleForTodo } from "./useBubbleForTodo";

export default function BubbleMenuForTodo({ editor }: { editor: Editor }) {
	const deleteHandler = () => {
		// 삭제 기능 추가
		editor
			.chain()
			.focus()
			.extendMarkRange("todoHighlight")
			.unsetTodoHighlight()
			.setTextSelection(editor.state.selection.to)
			.run();
	};
	return (
		<BubbleMenu
			editor={editor}
			className="border rounded-md bg-white"
			options={{ placement: "right-start" }}
		>
			<div className="flex flex-col">
				<TodoDiaglog editor={editor} />
				{/* 수정 기능 */}
				{/* 수정과 삭제 버튼은, 이미 저장된 것일 경우에만 나타내기 */}
				<Button onClick={deleteHandler}>할일 삭제</Button>
				<div>다른 메뉴 1</div>
				<div>다른 메뉴 2</div>
				<div>다른 메뉴 3</div>
			</div>
		</BubbleMenu>
	);
}

const TodoDiaglog = ({ editor }: { editor: Editor }) => {
	const { open, setOpen, form, onSubmit } = useBubbleForTodo(editor);

	const props = {
		title: "할 일 추가",
		onSubmit: form.handleSubmit(onSubmit, (err) => {
			console.log(err);
		}),
		open,
		setOpen,
	};

	return (
		<MakeDialog {...props}>
			<Button>할 일 추가</Button>
			<DatePickField
				fieldInfo={{ name: "dueDate", label: "날짜" }}
				form={form}
			/>
			<TextField fieldInfo={{ name: "content", label: "내용" }} form={form} />
		</MakeDialog>
	);
};
