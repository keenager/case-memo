import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$caseNumber/hearings/$hearingsId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { caseNumber, hearingsId } = Route.useParams();
	return (
		<div>
			Hello "/{caseNumber}/hearings/{hearingsId}"!
		</div>
	);
}
