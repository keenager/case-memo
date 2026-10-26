import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import z from "zod";
import DeleteHearingDialog from "@/components/dialog/DeleteHearingDialog";
import NewHearingDialog from "@/components/dialog/NewHearingDialog";
import UpdateHearingDialog from "@/components/dialog/UpdateHearingDialog";
import { Separator } from "@/components/ui/separator";
import type { CamelCase } from "@/lib/camelize";
import { formattedDate, strToDate } from "@/lib/date";
import { getHearingData } from "@/lib/db/read";
import type { HearingInDB } from "@/lib/hearing";
import { useHearing } from "@/store/hearing";

const searchParams = z.object({
	hearingOrder: z.optional(z.int().min(0)),
});

export const Route = createFileRoute("/$caseId/hearings")({
	validateSearch: searchParams,
	loader: async ({ params }) => {
		const hearingDataList = (await getHearingData(
			params.caseId,
		)) as CamelCase<HearingInDB>[];
		const simpleList = hearingDataList.map((data) => ({
			id: data.id,
			hearingDate: strToDate(data.hearingDate),
			hearingTime: data.hearingTime,
		}));
		useHearing.setState({ hearingList: simpleList });
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { caseId } = Route.useParams();

	const hearingList = useHearing((state) => state.hearingList);
	// console.log("hearings: ", hearingList);

	const selectedId = useHearing((state) => state.selectedId);
	const setSelectedId = useHearing((state) => state.setSelectedId);

	return (
		<div className="flex-1 overflow-y-auto flex">
			<div className="w-64 border-r text-center flex flex-col">
				<p className="p-2">기일</p>
				<Separator />
				{hearingList.map((hearing, idx) => (
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
								<UpdateHearingDialog targetHearing={hearing} />
								<DeleteHearingDialog targetHearing={hearing} />
							</div>
						</div>
						<Separator />
					</>
				))}
				<NewHearingDialog />
			</div>
			<Outlet />
		</div>
	);
}
