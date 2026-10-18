import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import z from "zod";
import NewHearingDialog from "@/components/dialog/NewHearingDialog";
import { Separator } from "@/components/ui/separator";
import type { CamelCase } from "@/lib/camelize";
import { getHearingData } from "@/lib/db/read";
import type { Hearing } from "@/lib/hearing";

const searchParams = z.object({
	hearingOrder: z.optional(z.int().min(1).gt(0)),
});

export const Route = createFileRoute("/$caseId/hearings")({
	validateSearch: searchParams,
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
			<div className="w-48 border-r text-center flex flex-col gap-2">
				<p className="pt-2">기일</p>
				<Separator />
				{Route.useLoaderData().map((hearing, idx) => (
					<>
						<Link
							key={hearing.id}
							to={"/$caseId/hearings/$hearingId"}
							params={{ caseId, hearingId: hearing.id }}
							search={{ hearingOrder: idx + 1 }}
						>
							<p>
								{idx + 1}차 {String(hearing.hearingDate)} {hearing.hearingTime}
							</p>
						</Link>
						<Separator />
					</>
				))}
				<NewHearingDialog caseId={caseId} />
			</div>
			{/* <div>Hello "/$caseNumber/hearings"!</div> */}
			<Outlet />
		</div>
	);
}
