import { Controller, type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { formattedDate } from "@/lib/date";
import type { FieldInfo } from "..//MakeDialog";

type Props = {
	fieldInfo: FieldInfo;
	form: UseFormReturn<any>;
};

export function DatePickField({ fieldInfo, form }: Props) {
	return (
		<Controller
			key={fieldInfo.name}
			name={fieldInfo.name}
			control={form.control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{fieldInfo.label}</FieldLabel>
					<Popover>
						<PopoverTrigger
							render={
								<Button
									variant="outline"
									id={field.name}
									className="justify-start font-normal"
								>
									{field.value ? (
										formattedDate(field.value)
									) : (
										<span>날짜를 지정하세요</span>
									)}
								</Button>
							}
						/>
						<PopoverContent className="w-auto p-0" align="start">
							<Calendar
								mode="single"
								selected={field.value}
								onSelect={field.onChange}
								defaultMonth={field.value}
							/>
						</PopoverContent>
					</Popover>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
