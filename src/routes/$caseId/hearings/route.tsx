import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";
import DeleteHearingDialog from "@/components/dialog/DeleteHearingDialog";
import NewHearingDialog from "@/components/dialog/NewHearingDialog";
import UpdateHearingDialog from "@/components/dialog/UpdateHearingDialog";
import { Separator } from "@/components/ui/separator";
import type { CamelCase } from "@/lib/camelize";
import { formattedDate, strToDate } from "@/lib/date";
import { getHearingData } from "@/lib/db/read";
import type { HearingInDB, HearingInList } from "@/lib/hearing";
import { useHearing } from "@/store/hearing";

const searchParams = z.object({
	hearingOrder: z.optional(z.int().min(0)),
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

	const [hearings, setHearings] = useState<HearingInList[]>(
		loadedHearingDataList.map((data) => ({
			id: data.id,
			hearingDate: strToDate(data.hearingDate),
			hearingTime: data.hearingTime,
		})),
	);
	console.log("hearings: ", hearings);

	const selectedId = useHearing((state) => state.selectedId);
	const setSelectedId = useHearing((state) => state.setSelectedId);

	return (
		<div className="flex-1 overflow-y-auto flex">
			<div className="w-64 border-r text-center flex flex-col">
				<p className="p-2">기일</p>
				<Separator />
				{hearings.map((hearing, idx) => (
					<>
						<div
							className={`p-2 flex justify-around items-center ${selectedId === hearing.id && "bg-accent"}`}
						>
							<Link
								key={hearing.id}
								to={"/$caseId/hearings/$hearingId"}
								params={{ caseId, hearingId: hearing.id }}
								search={{ hearingOrder: idx }}
								onClick={() => {
									setSelectedId(hearing.id);
								}}
							>
								<p>
									{idx + 1}차 {formattedDate(hearing.hearingDate)}{" "}
									{hearing.hearingTime}
								</p>
							</Link>
							<div className="flex">
								<UpdateHearingDialog
									targetHearing={hearing}
									updateList={setHearings}
								/>
								<DeleteHearingDialog
									caseId={caseId}
									targetHearing={hearing}
									updateList={setHearings}
								/>
							</div>
						</div>
						<Separator />
					</>
				))}
				<NewHearingDialog caseId={caseId} updateList={setHearings} />
			</div>
			<Outlet />
		</div>
	);
}
