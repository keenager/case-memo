import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	// FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { type CamelCase, toSnake } from "@/lib/camelize";
import { PARTIES, type ResultOfUseState } from "@/lib/commonType";
import { formattedDate } from "@/lib/date";
import { getDB } from "@/lib/db/db";
import { handleError } from "@/lib/error";
import { getNoShowHearings, type HearingInDB } from "@/lib/hearing";
import { useHearing } from "@/store/hearing";
import { toast } from "../ui/toast";

type ACProps = { hearingId: string; loadedHearing: CamelCase<HearingInDB> };

export default function AttendanceCheck({
	hearingId,
	loadedHearing: {
		plaintiffAttended,
		plaintiffNoState,
		plaintiffNotAttended,
		plaintiffLawyerAttended,
		plaintiffLawyerNoState,
		plaintiffLawyerNotAttended,
		defendantAttended,
		defendantNoState,
		defendantNotAttended,
		defendantLawyerAttended,
		defendantLawyerNoState,
		defendantLawyerNotAttended,
	},
}: ACProps) {
	const useStateObj = {
		plaintiff: {
			attended: useState(!!plaintiffAttended),
			noState: useState(!!plaintiffNoState),
			notAttended: useState(!!plaintiffNotAttended),
		},
		plaintiffLawyer: {
			attended: useState(!!plaintiffLawyerAttended),
			noState: useState(!!plaintiffLawyerNoState),
			notAttended: useState(!!plaintiffLawyerNotAttended),
		},
		defendant: {
			attended: useState(!!defendantAttended),
			noState: useState(!!defendantNoState),
			notAttended: useState(!!defendantNotAttended),
		},
		defendantLawyer: {
			attended: useState(!!defendantLawyerAttended),
			noState: useState(!!defendantLawyerNoState),
			notAttended: useState(!!defendantLawyerNotAttended),
		},
	};

	const dataList = useHearing((state) => state.hearingDataList);
	useEffect(() => {
		const noShowHearings = getNoShowHearings(dataList);
		if (noShowHearings.length >= 2)
			toast.add({
				title: "2회 쌍불",
				description: (
					<ol className="list-decimal list-inside">
						{noShowHearings.map((h) => (
							<li key={h.id}>
								{formattedDate(h.hearingDate)} {h.hearingTime}
							</li>
						))}
					</ol>
				),
			});
	}, [dataList]);

	return (
		<div className="flex flex-col gap-2">
			<h2>출석 여부 체크</h2>
			<div className="flex flex-wrap gap-1 mx-2">
				{/* //TODO: 선임된 변호사들 이름 띄운 다움에 표시할 수 있게 */}
				{PARTIES.map((item) => {
					const params = {
						...item,
						hearingId,
						attendedStatus: useStateObj[item.name].attended,
						noStateStatus: useStateObj[item.name].noState,
						notAttendedStatus: useStateObj[item.name].notAttended,
					};
					return <CheckList key={item.name} {...params} />;
				})}
			</div>
		</div>
	);
}

type CheckListProps = (typeof PARTIES)[number] & {
	hearingId: string;
	attendedStatus: ResultOfUseState<boolean>;
	noStateStatus: ResultOfUseState<boolean>;
	notAttendedStatus: ResultOfUseState<boolean>;
};

const getOppositeName = (name: string) => {
	const arr = name.split("_");
	return arr.includes("not")
		? arr.toSpliced(arr.indexOf("not"), 1).join("_")
		: arr.toSpliced(arr.length - 1, 0, "not").join("_");
};

function CheckList({
	label,
	name,
	hearingId,
	attendedStatus: [attended, setAttended],
	noStateStatus: [noState, setNoState],
	notAttendedStatus: [notAttended, setNotAttended],
}: CheckListProps) {
	const setDataList = useHearing((state) => state.setHearingDataListWithPrev);

	const saveAttendanceStatus = async (name: string, status: boolean) => {
		const snakeName = toSnake(name);
		const snakeName2 = getOppositeName(snakeName);

		// console.log(
		// 	`저장할 내용: 기일 ID ${hearingId} ${snakeName} = ${status} ${snakeName2} = ${!status} 출석 = ${attended}, 불출석 = ${notAttended}`,
		// );
		try {
			const db = await getDB();
			await db.execute(
				`UPDATE hearings SET ${snakeName}=$1, ${snakeName2}=$2, updated_at=CURRENT_TIMESTAMP WHERE id=$3`,
				[status ? 1 : 0, status ? 0 : 1, hearingId],
			);
		} catch (error) {
			handleError(error);
		}
	};
	const saveNoStateStatus = async (name: string, status: boolean) => {
		const snakeName = toSnake(name);
		try {
			const db = await getDB();
			await db.execute(
				`UPDATE hearings SET ${snakeName}_no_state=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2`,
				[status ? 1 : 0, hearingId],
			);
		} catch (error) {
			handleError(error);
		}
	};

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
							setAttended(checked);
							setNoState(false);
							setNotAttended(!checked);
							saveAttendanceStatus(`${name}Attended`, checked);
							setDataList((prev) => {
								const idx = prev.findIndex(
									(d) => d.id.toString() === hearingId,
								);
								const newList = prev.toSpliced(idx, 1, {
									...prev[idx],
									[`${name}Attended`]: checked,
									[`${name}NoState`]: false,
									[`${name}NotAttended`]: !checked,
								});
								return newList;
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
								setNoState(checked);
								saveNoStateStatus(name, checked);
								setDataList((prev) => {
									const idx = prev.findIndex(
										(d) => d.id.toString() === hearingId,
									);
									const newList = prev.toSpliced(idx, 1, {
										...prev[idx],
										[`${name}NoState`]: checked,
									});
									return newList;
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
							setAttended(!checked);
							setNoState(false);
							setNotAttended(checked);
							saveAttendanceStatus(`${name}NotAttended`, checked);
							setDataList((prev) => {
								const idx = prev.findIndex(
									(d) => d.id.toString() === hearingId,
								);
								const newList = prev.toSpliced(idx, 1, {
									...prev[idx],
									[`${name}Attended`]: !checked,
									[`${name}NoState`]: false,
									[`${name}NotAttended`]: checked,
								});
								return newList;
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
