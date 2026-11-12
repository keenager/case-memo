import { zodResolver } from "@hookform/resolvers/zod";
import type { Editor } from "@tiptap/core";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { TodoSchema } from "@/lib/todo/todo";
import { setTodoList, useTodo } from "@/store/todo";

export const useBubbleForTodo = (editor: Editor) => {
	const [open, setOpen] = useState(false);
	const { from, to } = editor.state.selection;
	const selectedText = editor.state.doc.textBetween(from, to);
	console.log("selectedText: ", selectedText);

	const form = useForm<z.infer<typeof TodoSchema>>({
		resolver: zodResolver(TodoSchema),
		defaultValues: {
			dueDate: new Date(),
			content: selectedText,
		},
		mode: "onChange",
	});

	const onSubmit = async (data: z.infer<typeof TodoSchema>) => {
		// 디비 저장 기능 추가
		setTodoList([...useTodo.getState().todoList, data]);
		editor
			.chain()
			.focus()
			.setTextSelection({ from, to })
			// 나중에 db에 저장하면 생성되는 id값을 넣기
			.setTodoHighlight({ todoId: Date.now().toString() })
			.setTextSelection(editor.state.selection.to)
			.run();
		setOpen(false);
		form.reset();
	};

	useEffect(() => {
		form.reset({ content: selectedText });
	}, [form, selectedText]);

	return { open, setOpen, form, onSubmit };
};
