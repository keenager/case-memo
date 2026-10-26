import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "@tanstack/react-router";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { getDB } from "@/lib/db/db";
import { handleError } from "@/lib/error";
import {
	checkSameHearing,
	getSortedHearingList,
	type HearingInList,
	newHearingFormSchema,
} from "@/lib/hearing";
import { useHearing } from "@/store/hearing";
import { Button } from "../ui/button";
import { DatePickField } from "./fields/DatePickField";
import TimePickField from "./fields/TimePickField";
import MakeDialog from "./MakeDialog";

type Props = {
	targetHearing: HearingInList;
};

export default function UpdateHearingDialog({ targetHearing }: Props) {
	const caseId = useParams({ strict: false }).caseId!;
	const [open, setOpen] = useState(false);
	const setHearingList = useHearing((state) => state.setHearingList);
	const setSelectedId = useHearing((state) => state.setSelectedId);

	const navi = useNavigate();

	console.log("targetHearing: ", targetHearing);

	const form = useForm<z.infer<typeof newHearingFormSchema>>({
		resolver: zodResolver(newHearingFormSchema),
		values: targetHearing,
		mode: "onChange",
	});

	async function onSubmit(data: z.infer<typeof newHearingFormSchema>) {
		console.log("Form submitted:", data);
		// Here you can handle the form submission, e.g., save to database or state
		try {
			const db = await getDB();

			// 같은 기일이 이미 존재한다면 경고를 띄우기.
			await checkSameHearing(caseId, data.hearingDate, data.hearingTime);

			const result = await db.execute(
				`
			    UPDATE hearings
				SET
					hearing_date = $1,
                    hearing_time = $2
			    WHERE
					id = $3
			`,
				[data.hearingDate, data.hearingTime, targetHearing.id],
			);
			console.log("Hearing saved:", result);

			let idx = -1;

			const newList = [...useHearing.getState().hearingList];
			const prevIdx = newList.findIndex((h) => h.id === targetHearing.id);
			newList.splice(prevIdx, 1, { id: targetHearing.id, ...data });
			const sortedList = getSortedHearingList(newList);
			idx = sortedList.findIndex((h) => h.id === targetHearing.id);

			setHearingList(sortedList);
			setSelectedId(targetHearing.id);
			setOpen(false); // Close the dialog after submission
			form.reset(); // Reset the form after submission
			//TODO: caseId가 여기 한군데에서만 쓰이는데, prop으로 받지 않고 route 훅을 통해 여기서 불러올 수 있을 듯.
			navi({
				to: "/$caseId/hearings/$hearingId",
				params: { caseId, hearingId: targetHearing.id },
				search: { hearingOrder: idx },
				// reloadDocument: true,
			});
		} catch (error) {
			handleError(error);
		}
	}

	const args = {
		open,
		setOpen,
		onSubmit: form.handleSubmit(onSubmit),
	};

	return (
		<MakeDialog title="기일 수정" {...args}>
			<Button variant="ghost" className="p-1">
				<PencilIcon size={20} />
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
