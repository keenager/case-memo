import { createFileRoute } from "@tanstack/react-router";
import AttendanceCheck from "@/components/section-detail/AttendanceCheck";
import MemoEditor from "@/components/section-detail/editor/MemoEditor";
import type { MemoLayoutProps } from "@/components/section-detail/MemoLayout";
import MemoLayout from "@/components/section-detail/MemoLayout";
import type { CamelCase } from "@/lib/camelize";
import { getCaseNumber, getHearingData, getMemo } from "@/lib/db/read";
import type { HearingInDB } from "@/lib/hearing";
import { SECTIONS } from "@/lib/sections";

export const Route = createFileRoute("/$caseId/hearings/$hearingId")({
	// beforeLoad:
	loader: async ({ params: { caseId, hearingId } }) => {
		const caseNumber = await getCaseNumber(caseId);

		const loadedHearingData = (await getHearingData(
			caseId,
			hearingId,
		)) as CamelCase<HearingInDB>;

		const loadedMemo = await getMemo({
			caseId,
			sectionCategory: "hearings",
			hearingId,
		});

		return { caseNumber, loadedHearingData, loadedMemo };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { caseId, hearingId } = Route.useParams();
	const { caseNumber, loadedHearingData, loadedMemo } = Route.useLoaderData();
	const props: MemoLayoutProps = {
		caseNumber,
		sectionName: SECTIONS.hearings.title,
		hearingOrder: Route.useSearch().hearingOrder,
	};
	const contents: string | undefined = loadedMemo?.contents;

	return (
		<MemoLayout {...props}>
			<AttendanceCheck
				key={hearingId}
				hearingId={hearingId}
				loadedHearing={loadedHearingData}
			/>
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
