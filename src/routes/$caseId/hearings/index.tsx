import { createFileRoute, Link } from "@tanstack/react-router";
import { camelizeKeys } from "@/lib/camelize";
import { formattedDate } from "@/lib/date";
import { readTodos } from "@/lib/db/read";
import { getNoShowHearings } from "@/lib/hearing";
import { useHearing } from "@/store/hearing";
import { setTodoList, useTodo } from "@/store/todo";

export const Route = createFileRoute("/$caseId/hearings/")({
	loader: async () => {
		const loadedTodoList = await readTodos();
		const polished = loadedTodoList
			.map((t) => camelizeKeys(t))
			.map((t) => ({ ...t, dueDate: new Date(t.dueDate) }));
		setTodoList(polished);
		return { loadedTodoList: polished };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { caseId } = Route.useParams();
	const hearingDataList = useHearing((s) => s.hearingDataList);
	const noShowHearings = getNoShowHearings(hearingDataList);
	const todoList = useTodo((s) => s.todoList);

	return (
		<div className="m-2 w-full">
			<h1 className="text-center">Overview</h1>
			<ul className="list-disc list-inside">
				<li>쌍방 불출석한 기일</li>
				<ol className="list-decimal list-inside pl-3">
					{noShowHearings.map((h) => (
						<li key={h.id}>
							{formattedDate(h.hearingDate)} {h.hearingTime}
						</li>
					))}
				</ol>
				<li>TO-DO</li>
				<ol className="list-decimal list-inside pl-3">
					{todoList.length > 0 &&
						todoList.map((t) => (
							<li key={t.id}>
								{formattedDate(t.dueDate)}:{" "}
								<Link
									to="/$caseId/hearings/$hearingId"
									params={{
										caseId,
										hearingId: t.hearingId.toString(),
									}}
									className="underline decoration-sky-500 decoration-2 underline-offset-4"
								>
									{t.content}
								</Link>
							</li>
						))}
				</ol>
			</ul>
		</div>
	);
}
