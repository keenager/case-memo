import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useDefaultCourt } from "@/store/settings";
import type { SelectItemList } from "../dialog/fields/SelectField";

type Props = {
	courts: SelectItemList;
};

export default function CourtSelect({ courts }: Props) {
	const selectedCourtId = useDefaultCourt((state) => state.courtId);
	// console.log("selectedCourtId: ", selectedCourtId);
	const setSelectedCourtId = useDefaultCourt((state) => state.updateCourtId);

	const itemList = [
		// { label: "법원을 선택하세요", value: null },
		{ label: "전체", value: "all" },
		...courts,
	];

	return (
		<Select
			items={itemList}
			value={selectedCourtId}
			onValueChange={setSelectedCourtId}
			// defaultValue={selectedCourtId}
		>
			<SelectTrigger className="w-45">
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
	);
}
