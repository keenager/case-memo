import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	// FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { toSnake } from "@/lib/camelize";
import { getDB } from "@/lib/db/db";
import type { Hearing } from "@/lib/hearing";

const CHECK_LIST = [
	{ title: "원고", name: "plaintiff" },
	{ title: "원고 대리인", name: "plaintiffLawyer" },
	{ title: "피고", name: "defendant" },
	{ title: "피고 대리인", name: "defendantLawyer" },
] as const;

type ACProps = { hearingId: string; loadedHearing: Hearing };

export default function AttendanceCheck({ hearingId, loadedHearing }: ACProps) {
	return (
		<div className="flex flex-col gap-2">
			<h2>출석 여부 체크</h2>
			<div className="flex flex-wrap gap-1 mx-2">
				{/* //TODO: 선임된 변호사들 이름 띄운 다움에 표시할 수 있게 */}
				{CHECK_LIST.map((item) => {
					const savedAttended = !!loadedHearing[`${item.name}Attended`];
					const savedNotAttended = !!loadedHearing[`${item.name}NotAttended`];
					const params = {
						...item,
						hearingId,
						savedAttended,
						savedNotAttended,
					};
					return <CheckList key={item.name} {...params} />;
				})}
			</div>
		</div>
	);
}

type CheckListProps = (typeof CHECK_LIST)[number] & {
	hearingId: string;
	savedAttended: boolean;
	savedNotAttended: boolean;
};

const getOppositeName = (name: string) => {
	const arr = name.split("_");
	return arr.includes("not")
		? arr.toSpliced(arr.indexOf("not"), 1).join("_")
		: arr.toSpliced(arr.length - 1, 0, "not").join("_");
};

function CheckList({
	title,
	name,
	hearingId,
	savedAttended,
	savedNotAttended,
}: CheckListProps) {
	const [attended, setAttended] = useState(savedAttended);
	const [notAttended, setNotAttended] = useState(savedNotAttended);

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
			console.log("Error saving attendance status:", error);
		}
	};
	return (
		<FieldSet className="min-w-30 max-w-50 mb-3">
			<FieldLegend variant="label">{title}</FieldLegend>
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
							setNotAttended(!checked);
							saveAttendanceStatus(`${name}Attended`, checked);
						}}
					/>
					<FieldLabel htmlFor={`${name}Attended`} className="font-normal">
						출석
					</FieldLabel>
				</Field>
				<Field orientation="horizontal">
					<Checkbox
						id={`${name}NotAttended`}
						name={`${name}NotAttended`}
						checked={notAttended}
						onCheckedChange={(checked: boolean) => {
							setNotAttended(checked);
							setAttended(!checked);
							saveAttendanceStatus(`${name}NotAttended`, checked);
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
