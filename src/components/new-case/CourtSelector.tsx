import type { ControllerFieldState } from "react-hook-form";
import type { CourtForSelect } from "@/lib/court";
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

// const CASE_TYPE = [
// 	{ label: "사건 유형을 선택하세요.", value: null },
// 	{ label: "민사", value: "civil" },
// 	{ label: "형사", value: "criminal" },
// ];

export default function CourtSelector({
	courts,
	fieldInfo,
	fieldState,
	value,
	onChange,
}: {
	courts: CourtForSelect[];
	fieldInfo: (typeof FIELD_INFO)[number];
	fieldState: ControllerFieldState;
	value: string;
	onChange: (...event: any[]) => void;
}) {
	courts.unshift({
		label: "법원을 선택하세요.",
		value: null,
		isBranch: false,
	});
	return (
		<Field data-invalid={fieldState.invalid}>
			<FieldLabel htmlFor={fieldInfo.name}>{fieldInfo.label}</FieldLabel>
			<Select
				items={courts}
				name={fieldInfo.name}
				value={value}
				onValueChange={onChange}
			>
				<SelectTrigger id={fieldInfo.name} aria-invalid={fieldState.invalid}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent alignItemWithTrigger={true}>
					<SelectGroup>
						{courts.map((item) => (
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
