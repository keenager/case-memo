import { createFileRoute } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import CaseList from "@/components/CaseList";
import NewCaseDialog from "@/components/new-case/NewCaseDialog";
import { camelizeKeys } from "@/lib/camelize";
import type { Case } from "@/lib/case";
import { DATABASE_NAME } from "@/lib/constants";
import { type Court, getCourtList } from "@/lib/court";

export const Route = createFileRoute("/")({
	loader: async () => {
		const db = await Database.load(DATABASE_NAME);
		const cases: Case[] = await db.select(`
			SELECT cases.*, courts.name AS court_name 
			FROM cases
			JOIN courts
			ON cases.court_id = courts.id`);
		const courts: Court[] = await db.select("SELECT * FROM courts");
		return { cases, courts };
	},
	component: Index,
});

function Index() {
	const cases = Route.useLoaderData().cases.map((row) => camelizeKeys(row));
	const courts = Route.useLoaderData().courts.map((row) => camelizeKeys(row));
	const filteredCourts = getCourtList(courts);

	// console.log("Loaded cases:", cases);
	// console.log("Loaded courts:", filteredCourts);
	return (
		<div className="p-2">
			<h1 className="text-center text-2xl">사건 메모</h1>
			<NewCaseDialog courts={filteredCourts} />
			<CaseList cases={cases} />
		</div>
	);
}
