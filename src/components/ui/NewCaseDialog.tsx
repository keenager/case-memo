import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";
import { type Case, newCaseFormSchema } from "@/lib/types";
import { Button } from "./button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "./field";
import { Input } from "./input";

const fieldInfo = [
	{ id: "caseNumber", name: "caseNumber", label: "Case Number" },
	{ id: "caseType", name: "caseType", label: "Case Type" },
	{ id: "caseName", name: "caseName", label: "Case Name" },
	{ id: "courtName", name: "courtName", label: "Court Name" },
	{ id: "filedAt", name: "filedAt", label: "Filed At" },
	{ id: "plaintiff", name: "plaintiff", label: "Plaintiff" },
	{ id: "plaintiffLawyer", name: "plaintiffLawyer", label: "Plaintiff Lawyer" },
	{ id: "defendant", name: "defendant", label: "Defendant" },
	{ id: "defendantLawyer", name: "defendantLawyer", label: "Defendant Lawyer" },
] as const;

export default function NewCaseDialog() {
	const [open, setOpen] = useState(false);
	const navi = useNavigate();

	const form = useForm<z.infer<typeof newCaseFormSchema>>({
		resolver: zodResolver(newCaseFormSchema),
		defaultValues: {
			caseNumber: "",
			caseType: "CIVIL",
			caseName: "",
			courtName: "",
			filedAt: "",
			plaintiff: "",
			plaintiffLawyer: "",
			defendant: "",
			defendantLawyer: "",
		},
		mode: "onChange",
	});

	// const { fields } = useFieldArray({
	// 	control: form.control,
	// 	name: "cases",
	// });

	async function onSubmit(data: z.infer<typeof newCaseFormSchema>) {
		console.log("Form submitted:", data);
		// Here you can handle the form submission, e.g., save to database or state
		try {
			const db = await Database.load("sqlite:test.db");

			// 법원명과 사건번호를 통해 같은 사건이 이미 존재한다면 경고를 띄우기.
			const existingCase: Case[] = await db.select(
				"SELECT * FROM cases WHERE court_name = $1 AND case_number = $2",
				[data.courtName, data.caseNumber],
			);
			if (existingCase.length > 0) {
				// TODO: 토스트 메시지 띄우기
				throw new Error("이미 존재하는 사건입니다.");
			}

			const result = await db.execute(
				`
                INSERT INTO cases (court_name, case_type, case_number, case_name, filed_at, plaintiff, plaintiff_lawyer, defendant, defendant_lawyer)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `,
				[
					data.courtName,
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
		} catch (error) {
			// TODO: 토스트 메시지 띄우기
			console.error("Error saving case:", error);
		}
		setOpen(false); // Close the dialog after submission
		form.reset(); // Reset the form after submission
		navi({ to: "/" });
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<div className="flex justify-end mb-4">
				<DialogTrigger
					render={
						<Button>
							<PlusIcon className="w-4 h-4 mr-2" />새 사건
						</Button>
					}
				/>
			</div>
			<DialogContent className="sm:max-w-sm">
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Create New Case</DialogTitle>
					</DialogHeader>
					<div className="my-5 -mx-4 max-h-[50vh] overflow-y-auto px-4">
						<FieldGroup>
							{fieldInfo.map((fi) => (
								<Controller
									key={fi.id}
									name={fi.name}
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor={field.name}>{fi.label}</FieldLabel>
											<Input
												{...field}
												id={field.name}
												type="text"
												aria-invalid={fieldState.invalid}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							))}
						</FieldGroup>
					</div>
					<DialogFooter>
						<DialogClose render={<Button variant="outline">취소</Button>} />
						<Button type="submit">저장</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
