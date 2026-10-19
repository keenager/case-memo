import { Controller, type UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { FieldInfo } from "../MakeDialog";

export type SelectItemList = { label: string; value: string | null }[];

type Props = {
	fieldInfo: FieldInfo;
	form: UseFormReturn<any>;
	itemList: SelectItemList;
};

export default function SelectField({ fieldInfo, form, itemList }: Props) {
	return (
		<Controller
			key={fieldInfo.name}
			name={fieldInfo.name}
			control={form.control}
			render={({ field, fieldState }) => (
				<Field data-invalid={fieldState.invalid}>
					<FieldLabel htmlFor={field.name}>{fieldInfo.label}</FieldLabel>
					<Select
						items={itemList}
						name={fieldInfo.name}
						value={field.value}
						onValueChange={field.onChange}
					>
						<SelectTrigger
							id={fieldInfo.name}
							aria-invalid={fieldState.invalid}
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent alignItemWithTrigger={true}>
							<SelectGroup>
								{itemList.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
				</Field>
			)}
		/>
	);
}
