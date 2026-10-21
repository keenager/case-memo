import { createFileRoute } from "@tanstack/react-router";
import NewCaseDialog from "@/components/dialog/NewCaseDialog";
import CaseList from "@/components/home_screen/CaseList";
import CourtSelect from "@/components/home_screen/CourtSelect";
import { camelizeKeys, type SnakeCase } from "@/lib/camelize";
import type { CaseInDB } from "@/lib/case";
import { type Court, getCourtList } from "@/lib/court";
import { strToDate } from "@/lib/date";
import { getDB } from "@/lib/db/db";

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
			}),
			courts: filteredCourts,
		};
	},
	component: Index,
});

function Index() {
	const { cases, courts } = Route.useLoaderData();
	// console.log("Loaded cases:", cases);

	return (
		<div className="p-2">
			<h1 className="text-center text-2xl">사건 메모</h1>
			<div className="my-2 flex justify-between">
				<CourtSelect courts={courts} />
				<NewCaseDialog courts={courts} />
			</div>
			<CaseList cases={cases} courts={courts} />
		</div>
	);
}
