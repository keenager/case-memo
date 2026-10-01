import { createFileRoute } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import CaseList from "@/components/CaseList";
import NewCaseDialog from "@/components/ui/NewCaseDialog";
import { snakeToCamel } from "@/lib/dbProcess";

export const Route = createFileRoute("/")({
	loader: async () => {
		const db = await Database.load("sqlite:test.db");
		const cases = await db.select("SELECT * FROM cases");
		return cases;
	},
	component: Index,
});

function Index() {
	const cases = snakeToCamel(Route.useLoaderData());
	console.log("Loaded cases:", cases);
	return (
		<div className="p-2">
			<h1 className="text-center text-2xl">사건 메모</h1>
			<NewCaseDialog />
			<CaseList cases={cases} />
		</div>
	);
}
