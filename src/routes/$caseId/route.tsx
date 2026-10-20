import { createFileRoute, Outlet } from "@tanstack/react-router";
import CaseInfoPanel from "@/components/info-panel/CaseInfoPanel";
import CoreInfo from "@/components/info-panel/CoreInfo";
import DetailInfo from "@/components/info-panel/DetailInfo";
import SectionsPanel from "@/components/section-panel/SectionPanel";
import { camelizeKeys, type SnakeCase } from "@/lib/camelize";
import type { CaseInDB } from "@/lib/case";
import { getDB } from "@/lib/db/db";

export const Route = createFileRoute("/$caseId")({
	loader: async ({ params }) => {
		const db = await getDB();

		const [loadedCase] = (await db.select(
			`SELECT cases.*, courts.name AS court_name
			FROM cases 
			JOIN courts 
			ON cases.court_id = courts.id 
			WHERE cases.id = $1`,
			[params.caseId],
		)) as SnakeCase<CaseInDB>[];

		return { loadedCase: camelizeKeys(loadedCase) };
	},
	component: MemoLayout,
});

function MemoLayout() {
	const { loadedCase } = Route.useLoaderData();

	return (
		<div className="flex-1 overflow-y-auto flex">
			{/* 좌측 패널 */}
			<div className="w-48 border-r flex flex-col shrink-0 overflow-hidden">
				{/* 핵심 정보 + 상세보기 */}
				<CaseInfoPanel>
					<CoreInfo selectedCase={loadedCase} />
					<DetailInfo selectedCase={loadedCase} />
				</CaseInfoPanel>
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
