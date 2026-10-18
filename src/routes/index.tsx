import { createFileRoute } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import CaseList from "@/components/CaseList";
import NewCaseDialog from "@/components/dialog/NewCaseDialog";
import { camelizeKeys, type SnakeCase } from "@/lib/camelize";
import type { Case } from "@/lib/case";
import { DATABASE_NAME } from "@/lib/constants";
import { type Court, getCourtList } from "@/lib/court";

export const Route = createFileRoute("/")({
	loader: async () => {
		const db = await Database.load(DATABASE_NAME);
		//TODO: 법원 선택해서 해당 법원 사건만 보여주기
		const cases: Case[] = await db.select(`
			SELECT cases.*, courts.name AS court_name 
			FROM cases
			JOIN courts
			ON cases.court_id = courts.id`);

		const courts: SnakeCase<Court>[] = await db.select("SELECT * FROM courts");
		const filteredCourts = getCourtList(courts);

		return {
			cases: cases.map((row) => camelizeKeys(row)),
			courts: filteredCourts,
		};
	},
	component: Index,
});

function Index() {
	const { cases, courts } = Route.useLoaderData();

	// console.log("Loaded cases:", cases);
	// console.log("Loaded courts:", filteredCourts);
	return (
		<div className="p-2">
			<h1 className="text-center text-2xl">사건 메모</h1>
			<NewCaseDialog courts={courts} />
			<CaseList cases={cases} />
		</div>
	);
}
