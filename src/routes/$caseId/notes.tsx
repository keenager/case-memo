import { createFileRoute } from "@tanstack/react-router";
import MemoEditor from "@/components/section-detail/editor/MemoEditor";
import type { MemoLayoutProps } from "@/components/section-detail/MemoLayout";
import MemoLayout from "@/components/section-detail/MemoLayout";
import { getCaseNumber, getMemo } from "@/lib/getFromDB";
import { SECTIONS } from "@/lib/sections";

export const Route = createFileRoute("/$caseId/notes")({
	loader: async ({ params }) => {
		const caseNumber = await getCaseNumber(params.caseId);

		const loadedMemo = await getMemo({
			caseId: params.caseId,
			sectionCategory: "notes",
		});
		const contents = loadedMemo?.contents;

		return { caseNumber, contents };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const props: MemoLayoutProps = {
		caseNumber: Route.useLoaderData().caseNumber,
		sectionName: SECTIONS.notes.title,
	};

	return (
		<MemoLayout {...props}>
			<MemoEditor
				caseId={Route.useParams().caseId}
				sectionCategory="notes"
				contents={Route.useLoaderData().contents}
			/>
		</MemoLayout>
	);
}
