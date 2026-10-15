import type { Case } from "@/lib/hearing";

export default function CaseName({ selectedCase }: { selectedCase: Case }) {
	return (
		<>
			{selectedCase.caseType === "CRIMINAL" && (
				<p className="text-sm">defendantSummary</p>
			)}
			<p className="text-sm text-muted-foreground">{selectedCase.caseName}</p>
		</>
	);
}
