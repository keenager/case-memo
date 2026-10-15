import type { ControllerFieldState } from "react-hook-form";
import { CASE_TYPE } from "@/lib/case";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import type { FIELD_INFO } from "./NewCaseDialog";

export default function CaseTypeSelector({
	fieldInfo,
	fieldState,
	value,
	onChange,
}: {
	fieldInfo: (typeof FIELD_INFO)[number];
	fieldState: ControllerFieldState;
	value: string;
	onChange: (...event: any[]) => void;
}) {
	return (
		<Field data-invalid={fieldState.invalid}>
			<FieldLabel htmlFor={fieldInfo.name}>{fieldInfo.label}</FieldLabel>
			<Select
				items={[
					{
						label: "사건 유형을 선택하세요.",
						value: null,
					},
					...CASE_TYPE,
				]}
				name={fieldInfo.name}
				value={value}
				onValueChange={onChange}
			>
				<SelectTrigger id={fieldInfo.name} aria-invalid={fieldState.invalid}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{CASE_TYPE.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
		</Field>
	);
}
