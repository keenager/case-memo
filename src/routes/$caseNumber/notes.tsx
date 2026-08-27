import { createFileRoute } from "@tanstack/react-router";
import MemoEditor from "@/components/editor/MemoEditor";
import type { MemoLayoutProps } from "@/components/section-detail/MemoLayout";
import MemoLayout from "@/components/section-detail/MemoLayout";

export const Route = createFileRoute("/$caseNumber/notes")({
	component: RouteComponent,
});

function RouteComponent() {
	const props: MemoLayoutProps = {
		caseNumber: Route.useParams().caseNumber,
		sectionName: "기타 메모",
	};
	return (
		<MemoLayout {...props}>
			<MemoEditor />
		</MemoLayout>
	);
}
