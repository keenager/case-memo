export type Case = {
	id: string;
	caseNumber: string;
	caseType: "CIVIL" | "CRIMINAL";
	caseName: string;
	court: string;
	filedAt: Date;
	createdAt: Date;
};
