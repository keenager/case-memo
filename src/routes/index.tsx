import { createFileRoute } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import CaseList from "@/components/CaseList";
import NewCaseDialog from "@/components/ui/NewCaseDialog";
import { camelizeKeys } from "@/lib/camelize";
import { DATABASE_NAME } from "@/lib/constants";
import type { Case } from "@/lib/types";

export const Route = createFileRoute("/")({
	loader: async () => {
		const db = await Database.load(DATABASE_NAME);
		const cases: Case[] = await db.select("SELECT * FROM cases");
		return cases;
	},
	component: Index,
});

function Index() {
	const cases = Route.useLoaderData().map((row) => camelizeKeys(row));

	console.log("Loaded cases:", cases);
	return (
		<div className="p-2">
			<h1 className="text-center text-2xl">사건 메모</h1>
			<NewCaseDialog />
			<CaseList cases={cases} />
		</div>
	);
}
