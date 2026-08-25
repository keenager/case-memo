import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import type { Case } from "@/lib/types";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import CoreInfo from "./CoreInfo";
import DetailInfo from "./DetailInfor";

export default function CaseInfoPanel({ caseDetail }: { caseDetail: Case }) {
	const [isOpen, setIsOpen] = useState(false);
	// const { criminalCase } = caseDetail;

	// const defendants = criminalCase?.criminalDefendants ?? [];
	// const defendantSummary =
	// 	defendants.length === 0
	// 		? "피고인 미등록"
	// 		: defendants.length === 1
	// 			? defendants[0].name
	// 			: defendants.length < 5
	// 				? defendants.map((d) => d.name).join(", ")
	// 				: `${defendants[0].name} 외 ${defendants.length - 1}명`;

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			{/* 항상 보이는 핵심 정보 */}
			<CoreInfo caseDetail={caseDetail} />

			{/* 상세보기 토글 */}
			<CollapsibleTrigger className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors border-t">
				{isOpen ? (
					<>
						접기 <ChevronUpIcon className="w-3 h-3" />
					</>
				) : (
					<>
						상세보기 <ChevronDownIcon className="w-3 h-3" />
					</>
				)}
			</CollapsibleTrigger>

			{/* 펼쳐지는 상세 정보 */}
			<CollapsibleContent>
				<DetailInfo caseDetail={caseDetail} />
			</CollapsibleContent>
		</Collapsible>
	);
}
