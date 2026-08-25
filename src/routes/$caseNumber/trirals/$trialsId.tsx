import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$caseNumber/trirals/$trialsId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/$caseNumber/trirals/$trialsId"!</div>;
}
