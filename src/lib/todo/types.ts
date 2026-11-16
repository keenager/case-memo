import z from "zod";
import type { SnakeCase } from "../camelize";

export const TodoFormSchema = z.object({
	content: z.string().min(1, { error: "내용을 1자 이상 입력하세요." }),
	dueDate: z.date({
		error: (issue) =>
			issue.input === undefined ? "날짜를 입력하세요." : "잘못된 날짜입니다.",
	}),
});

type TodoBasic = { id: number; hearingId: number; isDone: boolean };
type TodoInForm = z.infer<typeof TodoFormSchema>;

export type TodoInFront = TodoBasic & TodoInForm;

export type TodoInDB = SnakeCase<
	TodoBasic & Omit<TodoInForm, "dueDate"> & { dueDate: string }
>;
