import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import NewCaseDialog from "@/components/dialog/NewCaseDialog";
import CaseList from "@/components/home_screen/CaseList";
import CourtSelect from "@/components/home_screen/CourtSelect";
import SearchByCaseName from "@/components/home_screen/SearchByCaseName";
import SearchByCaseNumber from "@/components/home_screen/SearchByCaseNumber";
import { Button } from "@/components/ui/button";
import { camelizeKeys, type SnakeCase } from "@/lib/camelize";
import type { CaseInDB, CaseInFront } from "@/lib/case";
import { type Court, getCourtList } from "@/lib/court";
import { strToDate } from "@/lib/date";
import { getDB } from "@/lib/db/db";
import { useDefaultCourt } from "@/store/settings";

export const Route = createFileRoute("/")({
	loader: async () => {
		const db = await getDB();

		const cases: CaseInDB[] = await db.select(`
			SELECT cases.*, courts.name AS court_name 
			FROM cases
			JOIN courts
			ON cases.court_id = courts.id`);
		cases.forEach((c) => {
			c.court_id = c.court_id.toString();
		});
		// console.log("cases: ", cases);

		const courts: SnakeCase<Court>[] = await db.select("SELECT * FROM courts");
		const filteredCourts = getCourtList(courts);

		return {
			cases: cases.map((row) => {
				const newRow = { ...row, filed_at: strToDate(row.filed_at) };
				return camelizeKeys(newRow);
			}) as CaseInFront[],
			courts: filteredCourts,
		};
	},
	component: Index,
});

function Index() {
	const { cases, courts } = Route.useLoaderData();
	// console.log("Loaded cases:", cases);
	const setSelectedCourtId = useDefaultCourt((state) => state.updateCourtId);
	const [searchNumber, setSearchNumber] = useState<string | undefined>(
		undefined,
	);
	const [searchName, setSearchName] = useState<string | undefined>(undefined);

	return (
		<div className="p-2">
			<h1 className="text-center text-2xl">사건 메모</h1>
			<div className="my-2 flex justify-between">
				<div className="flex gap-1">
					<CourtSelect courts={courts} />
					<SearchByCaseNumber
						search={searchNumber}
						setSearch={setSearchNumber}
					/>
					<SearchByCaseName search={searchName} setSearch={setSearchName} />
					<Button
						onClick={() => {
							setSelectedCourtId("all");
							setSearchNumber(undefined);
							setSearchName(undefined);
						}}
					>
						초기화
					</Button>
				</div>
				<NewCaseDialog courts={courts} />
			</div>
			<CaseList
				cases={cases}
				courts={courts}
				search={{ byNumber: searchNumber, byName: searchName }}
			/>
		</div>
	);
}
