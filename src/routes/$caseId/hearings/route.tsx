import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import Database from "@tauri-apps/plugin-sql";
import { Separator } from "@/components/ui/separator";
import { camelizeKeys, type SnakeCase } from "@/lib/camelize";
import { DATABASE_NAME } from "@/lib/constants";
import type { Hearing } from "@/lib/hearing";
import NewHearingDialog from "./NewHearingDialog";

export const Route = createFileRoute("/$caseId/hearings")({
	loader: async ({ params }) => {
		const db = await Database.load(DATABASE_NAME);
		const loadedHearings: SnakeCase<Hearing>[] = await db.select(
			"SELECT * FROM hearings WHERE case_id = $1 ORDER BY hearing_date ASC, hearing_time ASC",
			[params.caseId],
		);
		return loadedHearings;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { caseId } = Route.useParams();
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
						to="/$caseId/hearings/$hearingId"
						params={{ caseId, hearingId: hearing.id }}
					>
						<p>
							{idx + 1}차 {String(hearing.hearingDate)} {hearing.hearingTime}
						</p>
						<Separator className="my-2" />
					</Link>
				))}
				<Separator className="mb-2" />
				<NewHearingDialog caseId={caseId} />
			</div>
			{/* <div>Hello "/$caseNumber/hearings"!</div> */}
			<Outlet />
		</div>
	);
}
