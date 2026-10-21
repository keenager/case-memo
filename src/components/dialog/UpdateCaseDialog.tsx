import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { CASE_TYPE, type CaseInFront, newCaseFormSchema } from "@/lib/case";
import { getDB } from "@/lib/db/db";
import { Button } from "../ui/button";
import { DatePickField } from "./fields/DatePickField";
import SelectField, { type SelectItemList } from "./fields/SelectField";
import TextField from "./fields/TextField";
import MakeDialog from "./MakeDialog";

export default function UpdateCaseDialog({
	courts,
	selectedCase,
}: {
	courts: SelectItemList;
	selectedCase: CaseInFront;
}) {
	const [open, setOpen] = useState(false);
	const navi = useNavigate();

	// const valuesToForm: CaseInFront = {
	// 	...selectedCase,
	// 	filedAt: strToDate(selectedCase.filedAt),
	// };

	const form = useForm<z.infer<typeof newCaseFormSchema>>({
		resolver: zodResolver(newCaseFormSchema),
		defaultValues: selectedCase,
		mode: "onChange",
	});

	async function onSubmit(data: z.infer<typeof newCaseFormSchema>) {
		console.log("Form submitted:", data);
		// Here you can handle the form submission, e.g., save to database or state
		try {
			const db = await getDB();

			const result = await db.execute(
				`
			    UPDATE cases
				SET
					court_id = $1, 
					case_type = $2, 
					case_number = $3, 
					case_name = $4, 
					filed_at = $5, 
					plaintiff = $6, 
					plaintiff_lawyer = $7, 
					defendant = $8, 
					defendant_lawyer = $9
			    WHERE
					court_id = $10 AND case_number = $11
			`,
				[
					data.courtId,
					data.caseType,
					data.caseNumber,
					data.caseName,
					data.filedAt,
					data.plaintiff,
					data.plaintiffLawyer,
					data.defendant,
					data.defendantLawyer,
					//
					selectedCase.courtId,
					selectedCase.caseNumber,
				],
			);
			console.log("Case saved:", result);
		} catch (error) {
			// TODO: 토스트 메시지 띄우기
			console.error("Error saving case:", error);
		}
		setOpen(false); // Close the dialog after submission
		form.reset(); // Reset the form after submission
		navi({ to: "/" });
	}

	const args = {
		open,
		setOpen,
		onSubmit: form.handleSubmit(onSubmit),
	};

	return (
		<MakeDialog title="사건 정보 수정" {...args}>
			<Button variant="ghost">
				<PencilIcon size={20} />
			</Button>
			<SelectField
				fieldInfo={{ name: "courtId", label: "법원" }}
				form={form}
				itemList={[
					{
						label: "법원을 선택하세요.",
						value: null,
					},
					...courts,
				]}
			/>
			<TextField
				fieldInfo={{ name: "caseNumber", label: "사건 번호" }}
				form={form}
			/>
			<SelectField
				fieldInfo={{ name: "caseType", label: "사건 유형" }}
				form={form}
				itemList={[
					{
						label: "사건 유형을 선택하세요.",
						value: null,
					},
					...CASE_TYPE,
				]}
			/>
			<TextField
				fieldInfo={{ name: "caseName", label: "사건명" }}
				form={form}
			/>
			<DatePickField
				fieldInfo={{ name: "filedAt", label: "소 제기일" }}
				form={form}
			/>
			{[
				{ name: "plaintiff", label: "원고" },
				{ name: "plaintiffLawyer", label: "원고 대리인" },
				{ name: "defendant", label: "피고" },
				{ name: "defendantLawyer", label: "피고 대리인" },
			].map((fi) => (
				<TextField key={fi.name} fieldInfo={fi} form={form} />
			))}
		</MakeDialog>
	);
}
