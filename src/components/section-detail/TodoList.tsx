import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { formattedDate } from "@/lib/date";
import { createUpdateTodo } from "@/lib/db/createUpdate";
import { handleError } from "@/lib/error";
import type { TodoInFront } from "@/lib/todo/types";
import { setSelectedId, useHearing } from "@/store/hearing";
import { setTodoList, useTodo } from "@/store/todo";
import DeleteTodo from "./DeleteTodo";

export default function TodoList({ todoList }: { todoList: TodoInFront[] }) {
	const { caseId } = useParams({ from: "/$caseId/hearings" });
	return (
		<ol className="list-decimal list-inside pl-3">
			{todoList.map((t) => (
				<TodoListItem key={t.id} caseId={caseId} todo={t} />
			))}
		</ol>
	);
}

const TodoListItem = ({
	caseId,
	todo,
}: {
	caseId: string;
	todo: TodoInFront;
}) => {
	const [isDone, setIsDone] = useState(!!todo.isDone);
	const hearingList = useHearing((s) => s.hearingList);
	const idx = hearingList.findIndex((h) => +h.id === todo.hearingId);
	const changeHandler = async (val: boolean) => {
		const updatedTodo = { ...todo, isDone: val };
		try {
			await createUpdateTodo(updatedTodo, todo.id.toString());
			const prevList = useTodo.getState().todoList ?? [];
			const newList = prevList.toSpliced(
				prevList.indexOf(todo),
				1,
				updatedTodo,
			);
			setTodoList(newList);
			setIsDone(val);
		} catch (error) {
			handleError(error);
		}
	};
	return (
		<li>
			<Field
				orientation="horizontal"
				className="inline-flex w-auto align-middle"
			>
				<Checkbox
					id={`checkbox-${todo.id}`}
					name={`checkbox-${todo.id}`}
					checked={isDone}
					onCheckedChange={changeHandler}
				/>
				<FieldLabel htmlFor={`checkbox-${todo.id}`}>
					{formattedDate(todo.dueDate)}까지: {todo.content}
					<Link
						to="/$caseId/hearings/$hearingId"
						params={{
							caseId,
							hearingId: String(todo.hearingId),
						}}
						search={{ hearingOrder: idx }}
						onClick={() => {
							setSelectedId(todo.hearingId);
						}}
						className="underline decoration-sky-500 decoration-2 underline-offset-4"
					>
						{`[${formattedDate(hearingList[idx].hearingDate)}
						${hearingList[idx].hearingTime} ${idx + 1}차 기일]`}
					</Link>
				</FieldLabel>
				<DeleteTodo todo={todo} />
			</Field>
		</li>
	);
};
