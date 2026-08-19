"use client";

import { TrashIcon, FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Case } from "@/lib/types";

// import { deleteCase } from "../actions/case";
// import CreateCaseModal from "./CreateCaseModal";



type Props = {
	cases: Case[];
};

const caseTypeLabel = {
	CIVIL: "민사",
	CRIMINAL: "형사",
};

export default function CaseList({ cases }: Props) {
	return (
		<>
			{cases.length === 0 ? (
				<div className="text-center py-16 text-muted-foreground">
					등록된 사건이 없습니다.
				</div>
			) : (
				<div className="space-y-2">
					{cases.map((c) => (
						<div
							key={c.id}
							className="flex items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
						>
							<div className="flex-1 cursor-pointer" >
								<div className="flex items-center gap-2">
									<span
										className={`text-xs px-2 py-0.5 rounded-full font-medium ${
											c.caseType === "CRIMINAL"
												? "bg-red-100 text-red-700"
												: "bg-blue-100 text-blue-700"
										}`}
									>
										{caseTypeLabel[c.caseType]}
									</span>
									<span className="font-medium">{c.caseNumber}</span>
									<span className="text-muted-foreground">{c.caseName}</span>
								</div>
								<div className="text-sm text-muted-foreground mt-1">
									{c.court} ·{" "}
								</div>
							</div>

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
						</div>
					))}
				</div>
			)}

			{/* <CreateCaseModal open={modalOpen} onClose={() => setModalOpen(false)} /> */}
		</>
	);
}
