import type { Editor } from "@tiptap/core";
import z from "zod";
import type { SectionCategory } from "./sections";

export const newCaseFormSchema = z.object({
	//TODO: court_id를 반영하도록 수정해야 함.
	courtName: z.string().min(1, { message: "Court name is required" }),
	caseType: z.literal(["CIVIL", "CRIMINAL"], {
		message: "Case type must be one of CIVIL, CRIMINAL, or ADMINISTRATIVE",
	}),
	caseNumber: z.string().min(1, { message: "Case number is required" }),
	caseName: z.string().min(1, { message: "Case name is required" }),
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
	//TODO: Date 형식으로
	hearingDate: z.string().min(1, { message: "Hearing date is required" }),
	hearingTime: z.string().min(1, { message: "Hearing time is required" }),
	// plaintiffAttended: z.boolean(),
	// defendantAttended: z.boolean(),
	// plaintiffLawyerAttended: z.boolean(),
	// defendantLawyerAttended: z.boolean(),
});

export type Hearing = z.infer<typeof newHearingFormSchema> & {
	id: string;
	caseId: string;
} & AttendanceStatus;

export type AttendanceStatus = {
	plaintiffAttended: boolean;
	plaintiffNotAttended: boolean;
	defendantAttended: boolean;
	defendantNotAttended: boolean;
	plaintiffLawyerAttended: boolean;
	plaintiffLawyerNotAttended: boolean;
	defendantLawyerAttended: boolean;
	defendantLawyerNotAttended: boolean;
};
