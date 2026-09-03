import { createFileRoute } from "@tanstack/react-router";
import MemoEditor from "@/components/section-detail/editor/MemoEditor";
import MemoLayout, {
	type MemoLayoutProps,
} from "@/components/section-detail/MemoLayout";

export const Route = createFileRoute("/$caseNumber/witness-testimony")({
	component: RouteComponent,
});

function RouteComponent() {
	const props: MemoLayoutProps = {
		caseNumber: Route.useParams().caseNumber,
		sectionName: "증인 진술 요지",
	};
	return (
		<MemoLayout {...props}>
			<MemoEditor />
		</MemoLayout>
	);
}
