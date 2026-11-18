import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import z from "zod";
import DeleteHearingDialog from "@/components/dialog/DeleteHearingDialog";
import NewHearingDialog from "@/components/dialog/NewHearingDialog";
import UpdateHearingDialog from "@/components/dialog/UpdateHearingDialog";
import { Separator } from "@/components/ui/separator";
import type { CamelCase } from "@/lib/camelize";
import { camelizeKeys } from "@/lib/camelize";
import { formattedDate, strToDate } from "@/lib/date";
import { getHearingData, readTodos } from "@/lib/db/read";
import type { HearingInDB, HearingInList } from "@/lib/hearing";
import { setSelectedId, useHearing } from "@/store/hearing";
import { setTodoList } from "@/store/todo";

const searchParams = z.object({
	hearingOrder: z.optional(z.int().min(0)),
});

export const Route = createFileRoute("/$caseId/hearings")({
	validateSearch: searchParams,
	loader: async ({ params }) => {
		const hearingDataList = (await getHearingData(
			params.caseId,
		)) as CamelCase<HearingInDB>[];
		const simpleList: HearingInList[] = hearingDataList.map((data) => ({
			id: data.id,
			hearingDate: strToDate(data.hearingDate),
			hearingTime: data.hearingTime,
		}));
		const loadedTodoList = await readTodos();
		const polished = loadedTodoList
			.map((t) => camelizeKeys(t))
			.map((t) => ({
				...t,
				dueDate: new Date(t.dueDate),
			}))
			.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
		useHearing.setState({ hearingDataList, hearingList: simpleList });

		return { loadedTodoList: polished };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { caseId } = Route.useParams();
	const { loadedTodoList } = Route.useLoaderData();

	const hearingList = useHearing((state) => state.hearingList);
	const selectedId = useHearing((state) => state.selectedId);

	useEffect(() => {
		setTodoList(loadedTodoList);
	}, [loadedTodoList]);

	return (
		<div className="flex-1 overflow-y-auto flex">
			<div className="min-w-60 border-r text-center flex flex-col">
				<p className="p-2">기일</p>
				<Separator />
				{hearingList.map((hearing, idx) => (
					<div key={hearing.id}>
						<div
							className={`p-2 flex justify-around items-center ${selectedId === hearing.id && "bg-accent"}`}
						>
							<Link
								key={hearing.id}
								to={"/$caseId/hearings/$hearingId"}
								params={{ caseId, hearingId: String(hearing.id) }}
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
					</div>
				))}
				<NewHearingDialog />
			</div>
			<Outlet />
		</div>
	);
}
