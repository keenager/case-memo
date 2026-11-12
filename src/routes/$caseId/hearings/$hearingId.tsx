import { createFileRoute } from "@tanstack/react-router";
import MemoEditor from "@/components/editor/MemoEditor";
import AttendanceCheck from "@/components/section-detail/AttendanceCheck";
import type { MemoLayoutProps } from "@/components/section-detail/MemoLayout";
import MemoLayout from "@/components/section-detail/MemoLayout";
import { Button } from "@/components/ui/button";
import { getCaseNumber, getMemo } from "@/lib/db/read";
import { SECTIONS } from "@/lib/sections";

export const Route = createFileRoute("/$caseId/hearings/$hearingId")({
	// beforeLoad:
	loader: async ({ params: { caseId, hearingId } }) => {
		const caseNumber = await getCaseNumber(+caseId);
		const loadedMemo = await getMemo({
			caseId,
			sectionCategory: "hearings",
			hearingId,
		});

		return { caseNumber, loadedMemo };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { caseId, hearingId } = Route.useParams();
	const { caseNumber, loadedMemo } = Route.useLoaderData();
	const props: MemoLayoutProps = {
		caseNumber,
		sectionName: SECTIONS.hearings.title,
		hearingOrder: Route.useSearch().hearingOrder,
	};
	const contents: string | undefined = loadedMemo?.contents;

	return (
		<MemoLayout {...props}>
			<div className="flex">
				<AttendanceCheck key={hearingId} />
				<Button>할일 등록</Button>
			</div>
			<MemoEditor
				key={`${caseNumber}hearings${hearingId}}`}
				caseId={caseId}
				sectionCategory="hearings"
				hearingId={hearingId}
				contents={contents}
			/>
		</MemoLayout>
	);
}
