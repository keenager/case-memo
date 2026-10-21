import { Link } from "@tanstack/react-router";
import type { CaseInFront } from "@/lib/case";
import DeleteCaseDialog from "./dialog/DeleteCaseDialog";
import type { SelectItemList } from "./dialog/fields/SelectField";
import UpdateCaseDialog from "./dialog/UpdateCaseDialog";
import BadgeCaseType from "./ui/BadgeCaseType";
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

export default function CaseList({
	cases,
	courts,
}: {
	cases: CaseInFront[];
	courts: SelectItemList;
}) {
	if (cases.length === 0) {
		return (
			<div className="text-center py-16 text-muted-foreground">
				등록된 사건이 없습니다.
			</div>
		);
	}
	return (
		<div className="grid gap-2">
			{cases.map((c) => (
				<Card key={c.id}>
					<CardHeader>
						<Link to="/$caseId" params={{ caseId: c.id }} className="grow mr-4">
							<CardTitle>{`${c.courtName} ${c.caseNumber}`}</CardTitle>
							<CardDescription>
								<div className="flex items-center gap-2">
									<BadgeCaseType caseType={c.caseType} />
									<span className="font-medium">{c.caseNumber}</span>
									<span className="text-muted-foreground">{c.caseName}</span>
								</div>
							</CardDescription>
						</Link>
						<CardAction className="flex">
							<UpdateCaseDialog courts={courts} selectedCase={c} />
							<DeleteCaseDialog selectedCase={c} />
						</CardAction>
					</CardHeader>
				</Card>
			))}
		</div>
	);
}
