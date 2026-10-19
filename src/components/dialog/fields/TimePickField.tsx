import { Controller, type UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { FieldInfo } from "../MakeDialog";

type Props = {
	fieldInfo: FieldInfo;
	form: UseFormReturn<any>;
};

export default function TimePickField({ fieldInfo, form }: Props) {
	return (
		<Controller
			key={fieldInfo.name}
			name={fieldInfo.name}
			control={form.control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{fieldInfo.label}</FieldLabel>
					<Input
						type="time"
						step="300"
						id={field.name}
						aria-invalid={fieldState.invalid}
						value={field.value as string}
						onChange={field.onChange}
					/>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
