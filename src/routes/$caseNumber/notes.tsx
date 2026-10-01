import { createFileRoute } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import MemoEditor from "@/components/section-detail/editor/MemoEditor";
import type { MemoLayoutProps } from "@/components/section-detail/MemoLayout";
import MemoLayout from "@/components/section-detail/MemoLayout";
import type { Memo } from "@/lib/types";

export const Route = createFileRoute("/$caseNumber/notes")({
	loader: async ({ params }) => {
		const db = await Database.load("sqlite:test.db");
		const [loadedMemo] = (await db.select(
			"SELECT * FROM memos WHERE case_id = (SELECT id FROM cases WHERE case_number = $1) AND section_type = 'notes'",
			[params.caseNumber],
		)) as Memo[];
		return { loadedMemo };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const props: MemoLayoutProps = {
		caseNumber: Route.useParams().caseNumber,
		sectionName: "기타 메모",
	};
	const contents: string | undefined =
		Route.useLoaderData().loadedMemo?.contents;

	return (
		<MemoLayout {...props}>
			<MemoEditor sectionType="notes" contents={contents} />
		</MemoLayout>
	);
}
