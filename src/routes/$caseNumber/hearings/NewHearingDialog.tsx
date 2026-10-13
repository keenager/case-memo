import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type Hearing, newHearingFormSchema } from "@/lib/types";

const fieldInfo = [
	{ id: "hearingDate", name: "hearingDate", label: "Hearing Date" },
	{ id: "hearingTime", name: "hearingTime", label: "Hearing Time" },
] as const;

type Props = {
	caseNumber: string;
};

export default function NewHearingDialog({ caseNumber }: Props) {
	const [open, setOpen] = useState(false);
	const navi = useNavigate();

	const form = useForm<z.infer<typeof newHearingFormSchema>>({
		resolver: zodResolver(newHearingFormSchema),
		defaultValues: {
			hearingDate: "",
			hearingTime: "",
		},
		mode: "onChange",
	});

	async function onSubmit(data: z.infer<typeof newHearingFormSchema>) {
		console.log("Form submitted:", data);
		// Here you can handle the form submission, e.g., save to database or state
		try {
			const db = await Database.load(DATABASE_NAME);
			const [{ id: caseId }] = await db.select<{ id: number }[]>(
				"SELECT id FROM cases WHERE case_number = $1",
				[caseNumber],
			);
			console.log("caseId:", caseId);

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
				[caseId, data.hearingDate, data.hearingTime],
			);
			console.log("Hearing saved:", result);
			setOpen(false);
			form.reset();
			navi({
				to: "/$caseNumber/hearings/$hearingId",
				params: { caseNumber, hearingId: `${result.lastInsertId}` },
			});
		} catch (error) {
			// TODO: 토스트 메시지 띄우기
			console.error("Error saving case:", error);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<div className="flex justify-end mb-4">
				<DialogTrigger
					render={
						<Button>
							<PlusIcon className="w-4 h-4 mr-2" />새 기일
						</Button>
					}
				/>
			</div>
			<DialogContent className="sm:max-w-sm">
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>새 기일 만들기</DialogTitle>
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
