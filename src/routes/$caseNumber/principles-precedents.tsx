import MemoEditor from "@/components/editor/MemoEditor";
import "@/components/editor/styles.css";
import { createFileRoute } from "@tanstack/react-router";
import MemoLayout, {
	type MemoLayoutProps,
} from "@/components/section-detail/MemoLayout";

export const Route = createFileRoute("/$caseNumber/principles-precedents")({
	component: RouteComponent,
});

function RouteComponent() {
	const props: MemoLayoutProps = {
		caseNumber: Route.useParams().caseNumber,
		sectionName: "관련 법리 및 판례",
	};

	return (
		<MemoLayout {...props}>
			<MemoEditor />
		</MemoLayout>
	);
}
