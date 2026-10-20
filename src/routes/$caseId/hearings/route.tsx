import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import z from "zod";
import DeleteHearingDialog from "@/components/dialog/DeleteHearingDialog";
import NewHearingDialog from "@/components/dialog/NewHearingDialog";
import UpdateHearingDialog from "@/components/dialog/UpdateHearingDialog";
import { Separator } from "@/components/ui/separator";
import type { CamelCase } from "@/lib/camelize";
import { formattedDate } from "@/lib/date";
import { getHearingData } from "@/lib/db/read";
import type { HearingInDB } from "@/lib/hearing";

const searchParams = z.object({
	hearingOrder: z.optional(z.int().min(1).gt(0)),
});

export const Route = createFileRoute("/$caseId/hearings")({
	validateSearch: searchParams,
	loader: async ({ params }) => {
		const hearingDataList = await getHearingData(params.caseId);
		return hearingDataList;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const loadedHearingDataList =
		Route.useLoaderData() as CamelCase<HearingInDB>[];
	const { caseId } = Route.useParams();

	return (
		<div className="flex-1 overflow-y-auto flex">
			<div className="w-64 border-r text-center flex flex-col gap-2">
				<p className="pt-2">기일</p>
				<Separator />
				{loadedHearingDataList.map((hearing, idx) => (
					<>
						<div className="px-2 flex justify-around items-center">
							<Link
								key={hearing.id}
								to={"/$caseId/hearings/$hearingId"}
								params={{ caseId, hearingId: hearing.id }}
								search={{ hearingOrder: idx + 1 }}
							>
								<p>
									{idx + 1}차 {formattedDate(hearing.hearingDate)}{" "}
									{hearing.hearingTime}
								</p>
							</Link>
							<div className="flex">
								<UpdateHearingDialog
									caseId={caseId}
									selectedHearing={hearing}
								/>
								<DeleteHearingDialog
									caseId={caseId}
									hearingId={hearing.id}
									hearingDate={formattedDate(hearing.hearingDate)}
									hearingTime={hearing.hearingTime}
								/>
							</div>
						</div>
						<Separator />
					</>
				))}
				<NewHearingDialog caseId={caseId} />
			</div>
			<Outlet />
		</div>
	);
}
