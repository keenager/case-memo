import type { Case } from "@/lib/types";

export default function CaseName({ caseDetail }: { caseDetail: Case }) {
	return (
		<>
			{caseDetail.caseType === "CRIMINAL" && (
				<p className="text-sm">defendantSummary</p>
			)}
			<p className="text-sm text-muted-foreground">{caseDetail.caseName}</p>
		</>
	);
}
