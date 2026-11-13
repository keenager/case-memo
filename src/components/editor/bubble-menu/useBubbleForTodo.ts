import { zodResolver } from "@hookform/resolvers/zod";
import type { Editor } from "@tiptap/core";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { createUpdateTodo } from "@/lib/db/createUpdate";
import { handleError } from "@/lib/error";
import { TodoFormSchema } from "@/lib/todo/todo";
import { useHearing } from "@/store/hearing";
import { setTodoList, useTodo } from "@/store/todo";

export const useBubbleForTodo = (
	editor: Editor,
	existingTodoId: string | undefined,
) => {
	const [open, setOpen] = useState(false);
	const hearingId = useHearing((s) => s.selectedId);
	const existingTodo = useTodo((s) => s.todoList).find(
		(t) => t.id.toString() === existingTodoId,
	);
	const { from, to } = editor.state.selection;
	const selectedText = editor.state.doc.textBetween(from, to);

	const form = useForm<z.infer<typeof TodoFormSchema>>({
		resolver: zodResolver(TodoFormSchema),
		defaultValues: {
			dueDate: new Date(),
			content: selectedText,
		},
		mode: "onChange",
	});

	const onSubmit = async (data: z.infer<typeof TodoFormSchema>) => {
		console.log("hearingId: ", hearingId);
		try {
			const result = await createUpdateTodo(
				{ ...data, hearingId },
				existingTodoId,
			);

			const todoId =
				existingTodoId ?? (result.lastInsertId as number).toString();
			setTodoList([
				...useTodo.getState().todoList,
				{ ...data, id: +todoId, hearingId },
			]);

			editor
				.chain()
				.focus()
				.extendMarkRange("todoHighlight")
				.unsetTodoHighlight()
				.setTextSelection({ from, to })
				.setTodoHighlight({ todoId })
				.setTextSelection(editor.state.selection.to)
				.run();
			setOpen(false);
			form.reset();
		} catch (error) {
			handleError(error);
		}
	};

	useEffect(() => {
		form.reset({
			dueDate: existingTodoId ? existingTodo?.dueDate : new Date(),
			content: selectedText,
		});
	}, [form, selectedText, existingTodoId, existingTodo?.dueDate]);

	return { open, setOpen, form, onSubmit };
};
