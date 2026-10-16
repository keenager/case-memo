import { createFileRoute } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import AttendanceCheck from "@/components/section-detail/AttendanceCheck";
import MemoEditor from "@/components/section-detail/editor/MemoEditor";
import type { MemoLayoutProps } from "@/components/section-detail/MemoLayout";
import MemoLayout from "@/components/section-detail/MemoLayout";
import { camelizeKeys } from "@/lib/camelize";
import { DATABASE_NAME } from "@/lib/constants";
import type { Hearing } from "@/lib/hearing";
import type { Memo } from "@/lib/memo";
import { SECTIONS } from "@/lib/sections";

//TODO: 여기부터 수정!!!
export const Route = createFileRoute("/$caseId/hearings/$hearingId")({
	loader: async ({ params }) => {
		const db = await Database.load(DATABASE_NAME);
		const [{ case_number: caseNumber }] = (await db.select(
			"SELECT case_number FROM cases WHERE id = $1",
			[params.caseId],
		)) as { case_number: string }[];

		const [loadedHearingData] = (await db.select(
			`SELECT * FROM hearings WHERE id=$1 AND case_id = $2`,
			[params.hearingId, params.caseId],
		)) as Hearing[];
		const loadedHearing = camelizeKeys(loadedHearingData);

		const loadedMemoData = (await db.select(
			"SELECT * FROM memos WHERE case_id = $1 AND section_type = 'hearings' AND hearing_id = $2",
			[params.caseId, params.hearingId],
		)) as Memo[] | undefined;
		const loadedMemo = loadedMemoData
			? camelizeKeys(loadedMemoData)[0]
			: loadedMemoData;

		return { caseNumber, loadedHearing, loadedMemo };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { caseId, hearingId } = Route.useParams();
	const { caseNumber, loadedHearing, loadedMemo } = Route.useLoaderData();
	const props: MemoLayoutProps = {
		caseNumber,
		sectionName: SECTIONS.hearings.title,
		hearingId,
	};
	const contents: string | undefined = loadedMemo?.contents;

	return (
		<MemoLayout {...props}>
			<AttendanceCheck
				key={hearingId}
				hearingId={hearingId}
				loadedHearing={loadedHearing}
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
