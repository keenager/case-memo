import { createFileRoute } from "@tanstack/react-router";
import CaseList from "@/components/CaseList";
import NewCaseDialog from "@/components/dialog/NewCaseDialog";
import { camelizeKeys, type SnakeCase } from "@/lib/camelize";
import type { CaseInDB } from "@/lib/case";
import { type Court, getCourtList } from "@/lib/court";
import { strToDate } from "@/lib/date";
import { getDB } from "@/lib/db/db";

export const Route = createFileRoute("/")({
	loader: async () => {
		const db = await getDB();
		//TODO: 법원 선택해서 해당 법원 사건만 보여주기
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
	// console.log("Loaded courts:", filteredCourts);
	return (
		<div className="p-2">
			<h1 className="text-center text-2xl">사건 메모</h1>
			<div className="my-2 flex justify-end">
				<NewCaseDialog courts={courts} />
			</div>
			<CaseList cases={cases} courts={courts} />
		</div>
	);
}
