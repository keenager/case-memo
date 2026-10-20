import z from "zod";
import type { SnakeCase } from "./camelize";

export const newHearingFormSchema = z.object({
	hearingDate: z.date({
		error: (issue) =>
			issue.input === undefined ? "날짜를 입력하세요." : "잘못된 날짜입니다.",
	}),
	hearingTime: z.string().min(1, { message: "시각을 입력하세요" }),
	// plaintiffAttended: z.boolean(),
	// defendantAttended: z.boolean(),
	// plaintiffLawyerAttended: z.boolean(),
	// defendantLawyerAttended: z.boolean(),
});

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

export type HearingInForm = z.infer<typeof newHearingFormSchema> & {
	id: string;
	caseId: string;
} & AttendanceStatus;

export type HearingInDB = SnakeCase<
	Omit<HearingInForm, "hearingDate"> & {
		hearingDate: string;
	}
>;
