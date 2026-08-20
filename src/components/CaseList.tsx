import { Link } from "@tanstack/react-router";
import { FileTextIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Case } from "@/lib/types";
import { Badge } from "./ui/badge";
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

export default function CaseList({ cases }: { cases: Case[] }) {
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
				<Link
					to="/$caseNumber"
					params={{ caseNumber: c.caseNumber }}
					key={c.id}
				>
					<CaseCard key={c.id} case={c} />
				</Link>
			))}
		</div>
	);
}

const caseTypeLabel = {
	CIVIL: "민사",
	CRIMINAL: "형사",
};

const CaseCard = ({ case: caseItem }: { case: Case }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{caseItem.caseNumber}</CardTitle>
				<CardDescription>
					<div className="flex items-center gap-2">
						<Badge
							className={`text-xs px-2 py-0.5 rounded-full font-medium ${
								caseItem.caseType === "CRIMINAL"
									? "bg-red-100 text-red-700"
									: "bg-blue-100 text-blue-700"
							}`}
						>
							{caseTypeLabel[caseItem.caseType]}
						</Badge>
						<span className="font-medium">{caseItem.caseNumber}</span>
						<span className="text-muted-foreground">{caseItem.caseName}</span>
					</div>
				</CardDescription>
				<CardAction>
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							className="has-[>svg]:px-1"
							onClick={() => {}}
						>
							<FileTextIcon className="w-4 h-4" />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="has-[>svg]:px-1"
							onClick={() => {}}
						>
							<TrashIcon className="w-4 h-4 text-red-500" />
						</Button>
					</div>
				</CardAction>
			</CardHeader>
		</Card>
	);
};
