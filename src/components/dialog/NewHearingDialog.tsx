import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { DatePickField } from "@/components/dialog/fields/DatePickField";
import TimePickField from "@/components/dialog/fields/TimePickField";
import MakeDialog from "@/components/dialog/MakeDialog";
import { Button } from "@/components/ui/button";
import { getDB } from "@/lib/db/db";
import { handleError } from "@/lib/error";
import {
	getSortedHearingList,
	type HearingInDB,
	type HearingInList,
	newHearingFormSchema,
} from "@/lib/hearing";
import { useHearing } from "@/store/hearing";

type Props = {
	caseId: string;
	updateList: React.Dispatch<React.SetStateAction<HearingInList[]>>;
};

export default function NewHearingDialog({ caseId, updateList }: Props) {
	const [open, setOpen] = useState(false);
	const setSelectedId = useHearing((state) => state.setSelectedId);
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
			const db = await getDB();

			// 같은 기일이 이미 존재한다면 경고를 띄우기.
			const existingHearing: HearingInDB[] = await db.select(
				"SELECT * FROM hearings WHERE case_id = $1 AND hearing_date = $2 AND hearing_time = $3",
				[caseId, data.hearingDate, data.hearingTime],
			);
			if (existingHearing.length > 0) {
				throw new Error("이미 존재하는 기일입니다.", {
					cause: "날짜와 시각 중복",
				});
			}

			const result = await db.execute(
				`
			            INSERT INTO hearings (case_id, hearing_date, hearing_time)
			            VALUES ($1, $2, $3)
			    `,
				[caseId, data.hearingDate, data.hearingTime],
			);
			// console.log("Hearing saved:", result);

			const newHearingId = result.lastInsertId!.toString();
			let idx: number = -1;

			updateList((prev) => {
				const hearingList = [...prev, { id: newHearingId, ...data }];
				const newList = getSortedHearingList(hearingList);
				idx = newList.findIndex((item) => item.id === newHearingId);
				return newList;
			});

			setSelectedId(newHearingId);
			setOpen(false);
			form.reset();
			navi({
				to: "/$caseId/hearings/$hearingId",
				params: { caseId, hearingId: `${result.lastInsertId}` },
				search: { hearingOrder: idx },
				// reloadDocument: true,
			});
		} catch (error) {
			handleError(error);
		}
	}
	const args = { open, setOpen, onSubmit: form.handleSubmit(onSubmit) };

	return (
		<MakeDialog title="새 기일 만들기" {...args}>
			<Button className="cursor-pointer">
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
