import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import { Separator } from "@/components/ui/separator";
import { camelizeKeys } from "@/lib/camelize";
import type { Hearing } from "@/lib/types";
import NewHearingDialog from "./NewHearingDialog";

export const Route = createFileRoute("/$caseNumber/hearings")({
	loader: async ({ params }) => {
		const db = await Database.load("sqlite:test.db");
		const loadedHearings: Hearing[] = await db.select(
			"SELECT * FROM hearings WHERE case_id = (SELECT id FROM cases WHERE case_number = $1) ORDER BY hearing_date ASC, hearing_time ASC",
			[params.caseNumber],
		);
		return loadedHearings;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { caseNumber } = Route.useParams();
	const loadedHearings = Route.useLoaderData().map((row) => camelizeKeys(row));
	console.log("loadedHearings:", loadedHearings);
	return (
		<div className="flex-1 overflow-y-auto flex">
			<div className="w-48 border-r text-center flex flex-col">
				<p className="py-2">기일</p>
				<Separator className="mb-2" />
				{loadedHearings.map((hearing, idx) => (
					<Link
						key={hearing.id}
						to="/$caseNumber/hearings/$hearingId"
						params={{ caseNumber, hearingId: hearing.id }}
					>
						<p>
							{idx + 1}차 {hearing.hearingDate} {hearing.hearingTime}
						</p>
						<Separator className="my-2" />
					</Link>
				))}
				<Separator className="mb-2" />
				<NewHearingDialog caseNumber={caseNumber} />
			</div>
			{/* <div>Hello "/$caseNumber/hearings"!</div> */}
			<Outlet />
		</div>
	);
}
