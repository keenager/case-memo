import { createFileRoute } from "@tanstack/react-router";
import MemoEditor from "@/components/section-detail/editor/MemoEditor";
import type { MemoLayoutProps } from "@/components/section-detail/MemoLayout";
import MemoLayout from "@/components/section-detail/MemoLayout";

export const Route = createFileRoute("/$caseNumber/hearings/$hearingsId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { caseNumber, hearingsId } = Route.useParams();
	const props: MemoLayoutProps = {
		caseNumber,
		sectionName: "기일 진행",
		hearingsId,
	};
	return (
		<MemoLayout {...props}>
			<MemoEditor />
		</MemoLayout>
	);
}
