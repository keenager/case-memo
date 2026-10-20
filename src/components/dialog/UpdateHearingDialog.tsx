import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import type { CamelCase } from "@/lib/camelize";
import { strToDate } from "@/lib/date";
import { getDB } from "@/lib/db/db";
import { type HearingInDB, newHearingFormSchema } from "@/lib/hearing";
import { Button } from "../ui/button";
import { DatePickField } from "./fields/DatePickField";
import TimePickField from "./fields/TimePickField";
import MakeDialog from "./MakeDialog";

export default function UpdateHearingDialog({
	caseId,
	selectedHearing,
}: {
	caseId: string;
	selectedHearing: CamelCase<HearingInDB>;
}) {
	const [open, setOpen] = useState(false);
	const navi = useNavigate();

	console.log("selectedHearing: ", selectedHearing);

	const valuesToForm = {
		...selectedHearing,
		hearingDate: strToDate(selectedHearing.hearingDate),
	};

	const form = useForm<z.infer<typeof newHearingFormSchema>>({
		resolver: zodResolver(newHearingFormSchema),
		defaultValues: valuesToForm,
		mode: "onChange",
	});

	async function onSubmit(data: z.infer<typeof newHearingFormSchema>) {
		console.log("Form submitted:", data);
		// Here you can handle the form submission, e.g., save to database or state
		try {
			const db = await getDB();

			const result = await db.execute(
				`
			    UPDATE hearings
				SET
					hearing_date = $1,
                    hearing_time = $2
			    WHERE
					id = $3
			`,
				[data.hearingDate, data.hearingTime, selectedHearing.id],
			);
			console.log("Case saved:", result);
		} catch (error) {
			// TODO: 토스트 메시지 띄우기
			console.error("Error saving case:", error);
		}
		setOpen(false); // Close the dialog after submission
		form.reset(); // Reset the form after submission
		navi({
			to: "/$caseId/hearings/$hearingId",
			params: { caseId, hearingId: selectedHearing.id },
			reloadDocument: true,
		});
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
