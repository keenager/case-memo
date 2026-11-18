import { createFileRoute } from "@tanstack/react-router";
import TodoList from "@/components/section-detail/TodoList";
import { formattedDate } from "@/lib/date";
import { getNoShowHearings } from "@/lib/hearing";
import { useHearing } from "@/store/hearing";
import { useTodo } from "@/store/todo";

export const Route = createFileRoute("/$caseId/hearings/")({
	component: RouteComponent,
});

function RouteComponent() {
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
				{todoList && todoList.length > 0 && <TodoList todoList={todoList} />}
			</ul>
		</div>
	);
}
