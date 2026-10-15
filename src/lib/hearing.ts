import z from "zod";

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
