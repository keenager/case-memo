import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import {
	Controller,
	type ControllerRenderProps,
	useForm,
} from "react-hook-form";
import type z from "zod";
import { type Case, newCaseFormSchema } from "@/lib/case";
import { DATABASE_NAME } from "@/lib/constants";
import type { CourtForSelect } from "@/lib/court";
import { formattedDate } from "@/lib/date";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import CaseTypeSelector from "./CaseTypeSelector";
import CourtSelector from "./CourtSelector";
import { DatePicker } from "./DatePicker";

export const FIELD_INFO = [
	{ name: "courtId", label: "법원" },
	{ name: "caseNumber", label: "사건 번호" },
	{ name: "caseType", label: "사건 유형" },
	{ name: "caseName", label: "사건명" },
	{ name: "filedAt", label: "소 제기일" },
	{ name: "plaintiff", label: "원고" },
	{ name: "plaintiffLawyer", label: "원고 대리인" },
	{ name: "defendant", label: "피고" },
	{ name: "defendantLawyer", label: "피고 대리인" },
] as const;

type FieldsWithoutSomething = ControllerRenderProps<
	Case,
	Exclude<keyof Case, "id" | "filedAt" | "courtId" | "caseType">
>;

export default function NewCaseDialog({
	courts,
}: {
	courts: CourtForSelect[];
}) {
	const [open, setOpen] = useState(false);
	const navi = useNavigate();
	// const [date, setDate] = useState<Date>();

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

	// const { fields } = useFieldArray({
	// 	control: form.control,
	// 	name: "cases",
	// });

	async function onSubmit(data: z.infer<typeof newCaseFormSchema>) {
		console.log("Form submitted:", data);
		// Here you can handle the form submission, e.g., save to database or state
		try {
			const db = await Database.load(DATABASE_NAME);

			// 법원명과 사건번호를 통해 같은 사건이 이미 존재한다면 경고를 띄우기.
			const existingCase: Case[] = await db.select(
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
					formattedDate(data.filedAt),
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
							{FIELD_INFO.map((fi) => (
								<Controller
									key={fi.name}
									name={fi.name}
									control={form.control}
									render={({ field, fieldState }) => {
										if (fi.name === "courtId") {
											return (
												<CourtSelector
													courts={courts}
													fieldInfo={fi}
													fieldState={fieldState}
													value={field.value as string}
													onChange={field.onChange}
												/>
											);
										} else if (fi.name === "caseType") {
											return (
												<CaseTypeSelector
													fieldInfo={fi}
													fieldState={fieldState}
													value={field.value as string}
													onChange={field.onChange}
												/>
											);
										} else if (fi.name === "filedAt") {
											return (
												<DatePicker
													fieldInfo={fi}
													fieldState={fieldState}
													value={field.value as Date}
													onChange={field.onChange}
												/>
											);
										} else {
											return (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel htmlFor={fi.name}>{fi.label}</FieldLabel>
													<Input
														{...(field as FieldsWithoutSomething)}
														id={fi.name}
														type="text"
														aria-invalid={fieldState.invalid}
													/>
													{fieldState.invalid && (
														<FieldError errors={[fieldState.error]} />
													)}
												</Field>
											);
										}
									}}
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
