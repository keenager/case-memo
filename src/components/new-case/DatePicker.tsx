import { format } from "date-fns";
import type { ControllerFieldState } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { formattedDate } from "@/lib/date";

type Props = {
	fieldInfo: { name: string; label: string };
	fieldState: ControllerFieldState;
	value: Date | undefined;
	onChange: (...event: any[]) => void;
};

export function DatePicker({ fieldInfo, fieldState, value, onChange }: Props) {
	return (
		<>
			{/* <Field className="mx-auto w-44"> */}
			<Field data-invalid={fieldState.invalid}>
				<FieldLabel htmlFor={fieldInfo.name}>{fieldInfo.label}</FieldLabel>
				<Popover>
					<PopoverTrigger
						render={
							<Button
								variant="outline"
								id={fieldInfo.name}
								className="justify-start font-normal"
							>
								{value ? formattedDate(value) : <span>날짜를 지정하세요</span>}
							</Button>
						}
					/>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							selected={value}
							onSelect={onChange}
							defaultMonth={value}
						/>
					</PopoverContent>
				</Popover>
				{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
			</Field>
		</>
	);
}
