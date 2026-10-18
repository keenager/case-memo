import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { DatePickField } from "@/components/dialog/DatePickField";
import MakeDialog from "@/components/dialog/MakeDialog";
import TimePickField from "@/components/dialog/TimePickField";
import { Button } from "@/components/ui/button";
import { DATABASE_NAME } from "@/lib/constants";
import { formattedDate } from "@/lib/date";
import { type Hearing, newHearingFormSchema } from "@/lib/hearing";

type Props = {
	caseId: string;
};

export default function NewHearingDialog({ caseId }: Props) {
	const [open, setOpen] = useState(false);
	const navi = useNavigate();

	const form = useForm<z.infer<typeof newHearingFormSchema>>({
		resolver: zodResolver(newHearingFormSchema),
		defaultValues: {
			hearingDate: undefined,
			hearingTime: "10:00",
		},
		mode: "onChange",
	});

	async function onSubmit(data: z.infer<typeof newHearingFormSchema>) {
		console.log("Form submitted:", data);
		// Here you can handle the form submission, e.g., save to database or state
		try {
			const db = await Database.load(DATABASE_NAME);
			// const [{ id: caseId }] = await db.select<{ id: number }[]>(
			// 	"SELECT id FROM cases WHERE case_number = $1",
			// 	[caseNumber],
			// );
			// console.log("caseId:", caseId);

			// 같은 기일이 이미 존재한다면 경고를 띄우기.
			const existingHearing: Hearing[] = await db.select(
				"SELECT * FROM hearings WHERE case_id = $1 AND hearing_date = $2 AND hearing_time = $3",
				[caseId, data.hearingDate, data.hearingTime],
			);
			if (existingHearing.length > 0) {
				// TODO: 토스트 메시지 띄우기
				throw new Error("이미 존재하는 기일입니다.");
			}

			const result = await db.execute(
				`
			            INSERT INTO hearings (case_id, hearing_date, hearing_time)
			            VALUES ($1, $2, $3)
			    `,
				[caseId, formattedDate(data.hearingDate), data.hearingTime],
			);
			console.log("Hearing saved:", result);
			setOpen(false);
			form.reset();
			navi({
				to: "/$caseId/hearings/$hearingId",
				params: { caseId, hearingId: `${result.lastInsertId}` },
			});
		} catch (error) {
			// TODO: 토스트 메시지 띄우기
			console.error("Error saving case:", error);
		}
	}
	const aaa = { form, onSubmit, open, setOpen };

	return (
		<MakeDialog title="새 기일 만들기" useDialogFormReturn={aaa}>
			<Button>
				<PlusIcon className="w-4 h-4 mr-2" />새 기일
			</Button>
			<DatePickField
				fieldInfo={{ name: "hearingDate", label: "날짜" }}
				form={form}
			/>
			<TimePickField
				fieldInfo={{ name: "hearingTime", label: "시각" }}
				form={form}
			/>
		</MakeDialog>
	);
}
