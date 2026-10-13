import { createFileRoute } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import AttendanceCheck from "@/components/section-detail/AttendanceCheck";
import MemoEditor from "@/components/section-detail/editor/MemoEditor";
import type { MemoLayoutProps } from "@/components/section-detail/MemoLayout";
import MemoLayout from "@/components/section-detail/MemoLayout";
import { camelizeKeys } from "@/lib/camelize";
import { DATABASE_NAME } from "@/lib/constants";
import { SECTIONS } from "@/lib/sections";
import type { Hearing, Memo } from "@/lib/types";

export const Route = createFileRoute("/$caseNumber/hearings/$hearingId")({
	loader: async ({ params }) => {
		const db = await Database.load(DATABASE_NAME);
		const [loadedHearing] = (await db.select(
			`SELECT * FROM hearings WHERE id=$1`,
			[params.hearingId],
		)) as Hearing[];
		const camelHearing = camelizeKeys(loadedHearing);

		const [loadedMemo] = (await db.select(
			"SELECT * FROM memos WHERE case_id = (SELECT id FROM cases WHERE case_number = $1) AND section_type = 'hearings' AND hearing_id = $2",
			[params.caseNumber, params.hearingId],
		)) as Memo[];

		return { camelHearing, loadedMemo };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { caseNumber, hearingId } = Route.useParams();
	const { camelHearing, loadedMemo } = Route.useLoaderData();
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
				loadedHearing={camelHearing}
			/>
			<MemoEditor
				key={`${caseNumber}hearings${hearingId}}`}
				sectionCategory="hearings"
				hearingId={hearingId}
				contents={contents}
			/>
		</MemoLayout>
	);
}
