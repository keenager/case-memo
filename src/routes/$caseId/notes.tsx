import { createFileRoute } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import MemoEditor from "@/components/section-detail/editor/MemoEditor";
import type { MemoLayoutProps } from "@/components/section-detail/MemoLayout";
import MemoLayout from "@/components/section-detail/MemoLayout";
import type { SnakeCase } from "@/lib/camelize";
import { DATABASE_NAME } from "@/lib/constants";
import type { Memo } from "@/lib/memo";
import { SECTIONS } from "@/lib/sections";

export const Route = createFileRoute("/$caseId/notes")({
	loader: async ({ params }) => {
		const db = await Database.load(DATABASE_NAME);
		const [loadedMemo] = (await db.select(
			`SELECT * FROM memos WHERE case_id = $1 AND section_type = "notes"`,
			[params.caseId],
		)) as SnakeCase<Memo>[];
		console.log("loadedMemo: ", loadedMemo);

		const { case_number: caseNumber } = (await db.select(
			`SELECT case_number FROM cases WHERE id = $1`,
			[params.caseId],
		)) as { case_number: string };
		return { loadedMemo, caseNumber };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const props: MemoLayoutProps = {
		caseNumber: Route.useLoaderData().caseNumber,
		sectionName: SECTIONS.notes.title,
	};
	const contents: string | undefined =
		Route.useLoaderData().loadedMemo?.contents;

	return (
		<MemoLayout {...props}>
			<MemoEditor
				caseId={Route.useParams().caseId}
				sectionCategory="notes"
				contents={contents}
			/>
		</MemoLayout>
	);
}
