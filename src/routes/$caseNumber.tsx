import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$caseNumber")({
	// In a loader
	// loader: ({ params }) => fetchPost(params.postId),
	// Or in a component
	component: MemoPage,
});

function MemoPage() {
	const { caseNumber } = Route.useParams();
	return <div>Hello "{caseNumber}"!</div>;
}
