import { createFileRoute } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import MemoEditor from "@/components/section-detail/editor/MemoEditor";
import type { MemoLayoutProps } from "@/components/section-detail/MemoLayout";
import MemoLayout from "@/components/section-detail/MemoLayout";
import type { Memo } from "@/lib/types";

export const Route = createFileRoute("/$caseNumber/hearings/$hearingId")({
	loader: async ({ params }) => {
		const db = await Database.load("sqlite:test.db");
		const [loadedMemo] = (await db.select(
			"SELECT * FROM memos WHERE case_id = (SELECT id FROM cases WHERE case_number = $1) AND section_type = 'hearings' AND hearing_id = $2",
			[params.caseNumber, params.hearingId],
		)) as Memo[];
		return { loadedMemo };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { caseNumber, hearingId } = Route.useParams();
	const props: MemoLayoutProps = {
		caseNumber,
		sectionName: "기일 진행",
		hearingId,
	};
	const contents: string | undefined =
		Route.useLoaderData().loadedMemo?.contents;

	return (
		<MemoLayout {...props}>
			<MemoEditor
				key={`${caseNumber}hearings${hearingId}}`}
				sectionCategory="hearings"
				hearingId={hearingId}
				contents={contents}
			/>
		</MemoLayout>
	);
}
