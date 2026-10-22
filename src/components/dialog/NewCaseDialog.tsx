import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { CASE_TYPE, type CaseInDB, newCaseFormSchema } from "@/lib/case";
import { getDB } from "@/lib/db/db";
import { Button } from "../ui/button";
import { DatePickField } from "./fields/DatePickField";
import SelectField, { type SelectItemList } from "./fields/SelectField";
import TextField from "./fields/TextField";
import MakeDialog from "./MakeDialog";

export default function NewCaseDialog({ courts }: { courts: SelectItemList }) {
	const [open, setOpen] = useState(false);
	const navi = useNavigate();

	const form = useForm<z.infer<typeof newCaseFormSchema>>({
		resolver: zodResolver(newCaseFormSchema),
		defaultValues: {
			caseNumber: "",
			caseType: undefined,
			caseName: "",
			courtId: undefined,
			filedAt: undefined,
			plaintiff: "",
			plaintiffLawyer: "",
			defendant: "",
			defendantLawyer: "",
		},
		mode: "onChange",
	});

	async function onSubmit(data: z.infer<typeof newCaseFormSchema>) {
		console.log("Form submitted:", data);
		// Here you can handle the form submission, e.g., save to database or state
		try {
			const db = await getDB();

			// 법원명과 사건번호를 통해 같은 사건이 이미 존재한다면 경고를 띄우기.
			const existingCase: CaseInDB[] = await db.select(
				"SELECT * FROM cases WHERE court_id = $1 AND case_number = $2",
				[data.courtId, data.caseNumber],
			);
			if (existingCase.length > 0) {
				// TODO: 토스트 메시지 띄우기
				throw new Error("이미 존재하는 사건입니다.");
			}

			const result = await db.execute(
				`
			    INSERT INTO cases (court_id, case_type, case_number, case_name, filed_at, plaintiff, plaintiff_lawyer, defendant, defendant_lawyer)
			    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
				],
			);
			console.log("Case saved:", result);
			setOpen(false); // Close the dialog after submission
			form.reset(); // Reset the form after submission
			navi({
				to: "/$caseId",
				params: { caseId: result.lastInsertId!.toString() },
			});
		} catch (error) {
			// TODO: 토스트 메시지 띄우기
			console.error("Error saving case:", error);
		}
	}

	const args = { open, setOpen, onSubmit: form.handleSubmit(onSubmit) };

	return (
		<MakeDialog title="새 사건" {...args}>
			<Button>
				<PlusIcon className="w-4 h-4 mr-2" />새 사건
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
