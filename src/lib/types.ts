export type Case = {
	id: string;
	caseNumber: string;
	caseType: "CIVIL" | "CRIMINAL";
	caseName: string;
	court: string;
	filedAt: Date;
	createdAt: Date;
};

export type SectionType = {
	title: string;
	route: string;
	order: number;
};
