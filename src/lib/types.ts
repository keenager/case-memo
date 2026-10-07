import type { Editor } from "@tiptap/core";
import z from "zod";
import type { SECTION_CATEGORIES } from "./constants";

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

export type Section = {
	title: string;
	route: string;
	order: number;
};

// (
// caseNumber: string,
// sectionType: SectionType,
// contents: ReturnType<Editor["getJSON"]>,
// hearingId?: string,
// )

export type SectionCategory = (typeof SECTION_CATEGORIES)[number];
type BaseArgsForSaveMemo = {
	caseNumber: string;
	// sectionCategory: SectionCategory;
	contents: ReturnType<Editor["getJSON"]>;
};
export type ArgsForSaveMemo =
	| (BaseArgsForSaveMemo & { sectionCategory: "hearings"; hearingId: string })
	| (BaseArgsForSaveMemo & {
			sectionCategory: Exclude<SectionCategory, "hearings">;
	  });

export type Memo = {
	id: number;
	case_id: number;
	section_type: SectionCategory;
	hearing_id?: number;
	contents: string;
	created_at: string;
	updated_at: string;
};

export const newHearingFormSchema = z.object({
	hearingDate: z.string().min(1, { message: "Hearing date is required" }),
	hearingTime: z.string().min(1, { message: "Hearing time is required" }),
	// plaintiffAttended: z.boolean(),
	// defendantAttended: z.boolean(),
	// plaintiffLawyerAttended: z.boolean(),
	// defendantLawyerAttended: z.boolean(),
});

export type Hearing = z.infer<typeof newHearingFormSchema> & {
	id: string;
	case_id: string;
	plaintiffAttended: boolean;
	plaintiffNotAttended: boolean;
	defendantAttended: boolean;
	defendantNotAttended: boolean;
	plaintiffLawyerAttended: boolean;
	plaintiffLawyerNotAttended: boolean;
	defendantLawyerAttended: boolean;
	defendantLawyerNotAttended: boolean;
};
