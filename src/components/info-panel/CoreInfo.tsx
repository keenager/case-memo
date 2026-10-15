import type { Case } from "@/lib/case";
import BadgeCaseType from "../ui/BadgeCaseType";
import CaseName from "./CaseName";

export default function CoreInfo({ selectedCase }: { selectedCase: Case }) {
	return (
		<div className="p-4 space-y-1.5">
			<div className="flex items-center gap-2">
				<BadgeCaseType caseType={selectedCase.caseType} />
				<span className="font-semibold text-sm">{selectedCase.caseNumber}</span>
			</div>
			{/* 사건명 */}
			<CaseName selectedCase={selectedCase} />
		</div>
	);
}
