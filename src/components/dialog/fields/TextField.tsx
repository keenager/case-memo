import { Controller, type UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type Props = {
	fieldInfo: { name: string; label: string };
	form: UseFormReturn<any>;
};

export default function TextField({ fieldInfo, form }: Props) {
	return (
		<Controller
			key={fieldInfo.name}
			name={fieldInfo.name}
			control={form.control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{fieldInfo.label}</FieldLabel>
					<Input
						{...field}
						id={fieldInfo.name}
						type="text"
						aria-invalid={fieldState.invalid}
					/>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
