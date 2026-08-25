import { createFileRoute } from "@tanstack/react-router";
import CaseInfoPanel from "@/components/info-panel/InfoPanel";
import SectionsPanel from "@/components/section-panel/SectionPanel";
import type { Case } from "@/lib/types";
import { cases } from "./index";

export const Route = createFileRoute("/111caseNumber")({
	// In a loader
	// loader: ({ params }) => fetchPost(params.postId),
	// Or in a component
	component: MemoPage,
});

function MemoPage() {
	const { caseNumber } = Route.useParams();
	const caseDetail: Case =
		cases.find((c) => c.caseNumber === caseNumber) || cases[0]; // 기본값으로 첫 번째 사건을 사용

	return (
		<div className="flex h-screen overflow-hidden">
			{/* 좌측 패널 */}
			<div className="w-64 border-r flex flex-col shrink-0 overflow-hidden">
				{/* 핵심 정보 + 상세보기 */}
				<CaseInfoPanel caseDetail={caseDetail} />
				{/* 섹션 목록 */}
				<SectionsPanel />
			</div>
			{/* 우측 에디터 */}
			<div className="flex-1 flex flex-col overflow-hidden">
				<div className="flex-1 overflow-y-auto p-4">
					우측 에디터
					{/* <SectionDetail caseDetail={caseDetail} /> */}
				</div>
			</div>
		</div>
	);
}
