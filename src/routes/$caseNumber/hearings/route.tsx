import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$caseNumber/hearings")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex-1 overflow-y-auto flex">
			<div className="w-48 border-r text-center">기일</div>
			<div>Hello "/$caseNumber/hearings"!</div>
		</div>
	);
}

const hearingList = ["2023-01-01", "2023-02-01", "2023-03-01"];
