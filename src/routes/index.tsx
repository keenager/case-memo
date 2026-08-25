import { createFileRoute } from "@tanstack/react-router";
import CaseList from "@/components/CaseList";
import NewCaseBtn from "@/components/ui/NewCaseBtn";
import type { Case } from "@/lib/types";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="p-2">
			<h1 className="text-center text-2xl">사건 메모</h1>
			<NewCaseBtn />
			<CaseList cases={cases} />
			{/* <CreateCaseModal open={modalOpen} onClose={() => setModalOpen(false)} /> */}
		</div>
	);
}

export const cases: Case[] = [
	{
		id: "1",
		caseNumber: "2023가합12345",
		caseType: "CIVIL",
		caseName: "대여금",
		court: "서울중앙지방법원",
		filedAt: new Date("2023-01-15"),
		createdAt: new Date("2023-01-10"),
	},
	{
		id: "2",
		caseNumber: "2024가합345",
		caseType: "CRIMINAL",
		caseName: "절도",
		court: "서울중앙지방법원",
		filedAt: new Date("2024-01-15"),
		createdAt: new Date("2024-01-10"),
	},
];
