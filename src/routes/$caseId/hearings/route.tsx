import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import type { CamelCase } from "@/lib/camelize";
import { getHearingData } from "@/lib/getFromDB";
import type { Hearing } from "@/lib/hearing";
import NewHearingDialog from "./NewHearingDialog";

export const Route = createFileRoute("/$caseId/hearings")({
	loader: async ({ params }) => {
		const hearingDataList = (await getHearingData(
			params.caseId,
		)) as CamelCase<Hearing>[];
		return hearingDataList;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { caseId } = Route.useParams();
	return (
		<div className="flex-1 overflow-y-auto flex">
			<div className="w-48 border-r text-center flex flex-col">
				<p className="py-2">기일</p>
				<Separator className="mb-2" />
				{Route.useLoaderData().map((hearing, idx) => (
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
