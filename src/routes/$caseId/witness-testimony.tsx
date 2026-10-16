import { createFileRoute } from "@tanstack/react-router";
import MemoEditor from "@/components/section-detail/editor/MemoEditor";
import MemoLayout, {
	type MemoLayoutProps,
} from "@/components/section-detail/MemoLayout";
import { getCaseNumber, getMemo } from "@/lib/getFromDB";
import { SECTIONS } from "@/lib/sections";

export const Route = createFileRoute("/$caseId/witness-testimony")({
	loader: async ({ params }) => {
		const caseNumber = await getCaseNumber(params.caseId);

		const loadedMemo = await getMemo({
			caseId: params.caseId,
			sectionCategory: "witness-testimony",
		});
		const contents = loadedMemo?.contents;

		return { caseNumber, contents };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const props: MemoLayoutProps = {
		caseNumber: Route.useLoaderData().caseNumber,
		sectionName: SECTIONS["witness-testimony"].title,
	};

	return (
		<MemoLayout {...props}>
			<MemoEditor
				caseId={Route.useParams().caseId}
				sectionCategory="witness-testimony"
				contents={Route.useLoaderData().contents}
			/>
		</MemoLayout>
	);
}
