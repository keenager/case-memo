import type { Case } from "@/lib/types";
import BadgeCaseType from "../ui/BadgeCaseType";
import CaseName from "./CaseName";

export default function CoreInfo({ caseDetail }: { caseDetail: Case }) {
	return (
		<div className="p-4 space-y-1.5">
			<div className="flex items-center gap-2">
				<BadgeCaseType caseType={caseDetail.caseType} />
				<span className="font-semibold text-sm">{caseDetail.caseNumber}</span>
			</div>
			{/* 사건명 */}
			<CaseName caseDetail={caseDetail} />
		</div>
	);
}
