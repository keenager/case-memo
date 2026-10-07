import { createFileRoute } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import MemoEditor from "@/components/section-detail/editor/MemoEditor";
import MemoLayout, {
	type MemoLayoutProps,
} from "@/components/section-detail/MemoLayout";
import type { Memo } from "@/lib/types";

export const Route = createFileRoute("/$caseNumber/witness-testimony")({
	loader: async ({ params }) => {
		const db = await Database.load("sqlite:test.db");
		const [loadedMemo] = (await db.select(
			"SELECT * FROM memos WHERE case_id = (SELECT id FROM cases WHERE case_number = $1) AND section_type = 'witness-testimony'",
			[params.caseNumber],
		)) as Memo[];
		return { loadedMemo };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const props: MemoLayoutProps = {
		caseNumber: Route.useParams().caseNumber,
		sectionName: "증인 진술 요지",
	};
	const contents: string | undefined =
		Route.useLoaderData().loadedMemo?.contents;

	return (
		<MemoLayout {...props}>
			<MemoEditor sectionCategory="witness-testimony" contents={contents} />
		</MemoLayout>
	);
}
