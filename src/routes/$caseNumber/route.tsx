import { createFileRoute, Outlet } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import CaseInfoPanel from "@/components/info-panel/InfoPanel";
import SectionsPanel from "@/components/section-panel/SectionPanel";
import { camelizeKeys } from "@/lib/camelize";
import type { Case } from "@/lib/types";

export const Route = createFileRoute("/$caseNumber")({
	loader: async ({ params }) => {
		const db = await Database.load("sqlite:test.db");

		const [loadedCases] = (await db.select(
			"SELECT * FROM cases WHERE case_number = $1",
			[params.caseNumber],
		)) as Case[];
		return loadedCases;
	},
	component: MemoLayout,
});

function MemoLayout() {
	const selectedCase = camelizeKeys(Route.useLoaderData());

	return (
		<div className="flex-1 overflow-y-auto flex">
			{/* 좌측 패널 */}
			<div className="w-48 border-r flex flex-col shrink-0 overflow-hidden">
				{/* 핵심 정보 + 상세보기 */}
				<CaseInfoPanel selectedCase={selectedCase} />
				{/* 섹션 목록 */}
				<SectionsPanel />
			</div>
			{/* 우측 패널 */}
			<Outlet />
			{/* <div className="flex-1 flex flex-col overflow-hidden">
				<div className="flex-1 overflow-y-auto p-4">
					우측 에디터
					<SectionDetail caseDetail={caseDetail} />
				</div>
			</div> */}
		</div>
	);
}
