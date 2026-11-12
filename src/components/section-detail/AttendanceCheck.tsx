import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	// FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { PARTIES } from "@/lib/commonType";
import { formattedDate } from "@/lib/date";
import { getNoShowHearings, initialHearingData } from "@/lib/hearing";
import {
	saveAttendanceStatus,
	saveNoStateStatus,
} from "@/lib/hearing/attendance";
import { setHearingDataListWithPrev, useHearing } from "@/store/hearing";
import { toast } from "../ui/toast";

export default function AttendanceCheck() {
	const dataList = useHearing((state) => state.hearingDataList);
	useEffect(() => {
		const noShowHearings = getNoShowHearings(dataList);
		if (noShowHearings.length >= 2)
			toast.add({
				title: "2회 쌍불",
				description: (
					<span>
						{noShowHearings.map((h) => (
							<span key={h.id} className="block">
								{formattedDate(h.hearingDate)} {h.hearingTime}
							</span>
						))}
					</span>
				),
			});
	}, [dataList]);

	return (
		<div className="flex flex-col gap-2 w-fit border rounded-md">
			<h2 className="text-center">출석 여부 체크</h2>
			<div className="flex flex-wrap gap-1 mx-2">
				{/* //TODO: 선임된 변호사들 이름 띄운 다움에 표시할 수 있게 */}
				{PARTIES.map((item) => (
					<CheckList key={item.name} {...item} />
				))}
			</div>
		</div>
	);
}

function CheckList({ label, name }: (typeof PARTIES)[number]) {
	const hearingId = useHearing((state) => state.selectedId);
	const currentData = useHearing(
		(state) =>
			state.hearingDataList.find((d) => d.id.toString() === hearingId) ??
			initialHearingData,
	);
	// sqlite에서는 true, false가 아니라 1, 0으로 저장하므로, !!을 통해 boolean 타입으로 변환
	const attended = !!(currentData?.[`${name}Attended`] ?? false);
	const noState = !!(currentData?.[`${name}NoState`] ?? false);
	const notAttended = !!(currentData?.[`${name}NotAttended`] ?? false);

	return (
		<FieldSet className="min-w-30 max-w-50 mb-3">
			<FieldLegend variant="label">{label}</FieldLegend>
			{/* <FieldDescription>
					Select the items you want to show on the desktop.
				</FieldDescription> */}
			<FieldGroup className="gap-3">
				<Field orientation="horizontal">
					<Checkbox
						id={`${name}Attended`}
						name={`${name}Attended`}
						checked={attended}
						onCheckedChange={(checked: boolean) => {
							saveAttendanceStatus(hearingId, `${name}Attended`, checked);
							const newData = {
								...currentData,
								[`${name}Attended`]: checked,
								[`${name}NoState`]: false,
								[`${name}NotAttended`]: !checked,
							};
							setHearingDataListWithPrev((prev) => {
								const idx = prev.findIndex(
									(d) => d.id.toString() === hearingId,
								);
								return prev.toSpliced(idx, 1, newData);
							});
						}}
					/>
					<FieldLabel htmlFor={`${name}Attended`} className="font-normal">
						출석
					</FieldLabel>
				</Field>
				{attended && (
					<Field orientation="horizontal">
						<Checkbox
							id={`${name}NoState`}
							name={`${name}NoState`}
							checked={noState}
							onCheckedChange={(checked: boolean) => {
								saveNoStateStatus(hearingId, name, checked);
								const newData = {
									...currentData,
									[`${name}NoState`]: checked,
								};
								setHearingDataListWithPrev((prev) => {
									const idx = prev.findIndex(
										(d) => d.id.toString() === hearingId,
									);
									return prev.toSpliced(idx, 1, newData);
								});
							}}
						/>
						<FieldLabel htmlFor={`${name}NoState`} className="font-normal">
							진술 X
						</FieldLabel>
					</Field>
				)}
				<Field orientation="horizontal">
					<Checkbox
						id={`${name}NotAttended`}
						name={`${name}NotAttended`}
						checked={notAttended}
						onCheckedChange={(checked: boolean) => {
							const newData = {
								...currentData,
								[`${name}Attended`]: !checked,
								[`${name}NoState`]: false,
								[`${name}NotAttended`]: checked,
							};
							saveAttendanceStatus(hearingId, `${name}NotAttended`, checked);
							setHearingDataListWithPrev((prev) => {
								const idx = prev.findIndex(
									(d) => d.id.toString() === hearingId,
								);
								return prev.toSpliced(idx, 1, newData);
							});
						}}
					/>
					<FieldLabel htmlFor={`${name}NotAttended`} className="font-normal">
						불출석
					</FieldLabel>
				</Field>
			</FieldGroup>
		</FieldSet>
	);
}
