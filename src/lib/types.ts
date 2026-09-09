import z from "zod";

export const newCaseFormSchema = z.object({
	caseNumber: z.string().min(1, { message: "Case number is required" }),
	caseType: z.literal(["CIVIL", "CRIMINAL"], {
		message: "Case type must be one of CIVIL, CRIMINAL, or ADMINISTRATIVE",
	}),
	caseName: z.string().min(1, { message: "Case name is required" }),
	courtName: z.string().min(1, { message: "Court name is required" }),
	filedAt: z.string().min(1, { message: "Filed at is required" }),
	plaintiff: z.string().min(2, { message: "Plaintiff is required" }),
	plaintiffLawyer: z
		.string()
		.min(2, { message: "Plaintiff lawyer is required" }),
	defendant: z.string().min(2, { message: "Defendant is required" }),
	defendantLawyer: z
		.string()
		.min(2, { message: "Defendant lawyer is required" }),
});

export type Case = z.infer<typeof newCaseFormSchema> & { id: string };

export type SectionType = {
	title: string;
	route: string;
	order: number;
};
