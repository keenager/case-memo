import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$caseId/trirals/$trialsId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/$caseNumber/trirals/$trialsId"!</div>;
}
