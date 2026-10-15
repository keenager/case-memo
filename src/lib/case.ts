import z from "zod";

export const CASE_TYPE = [
	{ label: "민사", value: "civil" },
	{ label: "형사", value: "criminal" },
] as const;

export const newCaseFormSchema = z.object({
	courtId: z.int({ message: "Court name is required" }),
	caseType: z.literal(
		CASE_TYPE.map((t) => t.value),
		{
			message: `${CASE_TYPE.map((t) => t.label).join(", ")} 중에서 선택하세요.`,
		},
	),
	caseNumber: z.string().min(1, { message: "사건 번호를 입력하세요." }),
	caseName: z.string().min(1, { message: "사건명을 입력하세요." }),
	filedAt: z.date({
		error: (issue) =>
			issue.input === undefined ? "날짜를 입력하세요." : "잘못된 날짜입니다.",
	}),
	plaintiff: z.string().min(2, { message: "이름을 두 자 이상 입력하세요." }),
	plaintiffLawyer: z
		.string()
		.min(2, { message: "이름을 두 자 이상 입력하세요." }),
	defendant: z.string().min(2, { message: "이름을 두 자 이상 입력하세요." }),
	defendantLawyer: z
		.string()
		.min(2, { message: "이름을 두 자 이상 입력하세요." }),
});

export type Case = z.infer<typeof newCaseFormSchema> & {
	id: string;
	courtName?: string;
};
