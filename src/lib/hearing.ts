import z from "zod";
import type { SnakeCase } from "./camelize";
import { formattedDate } from "./date";
import { getDB } from "./db/db";

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

export type HearingBasicInForm = z.infer<typeof newHearingFormSchema>;
export type HearingBasicInDB = Omit<HearingBasicInForm, "hearingDate"> & {
	hearingDate: string;
};

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

type Others = {
	id: string;
	caseId: string;
} & AttendanceStatus;

export type HearingInForm = HearingBasicInForm & Others;

export type HearingInDB = SnakeCase<HearingBasicInDB & Others>;

export type HearingInList = HearingBasicInForm & { id: string };

export const checkSameHearing = async (
	caseId: string,
	hearingDate: Date,
	hearingTime: string,
) => {
	const db = await getDB();

	const existingHearing: HearingInDB[] = await db.select(
		"SELECT * FROM hearings WHERE case_id = $1 AND hearing_date = $2 AND hearing_time = $3",
		[caseId, hearingDate, hearingTime],
	);

	if (existingHearing.length > 0) {
		throw new Error(
			`${formattedDate(existingHearing[0].hearing_date)} ${existingHearing[0].hearing_time}에 이미 기일이 있습니다.`,
			{ cause: "기일 중복" },
		);
	}
};
