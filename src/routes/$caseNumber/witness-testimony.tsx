import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$caseNumber/witness-testimony")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/$caseNumber/witness-testimony"!</div>;
}
