import { createFileRoute } from "@tanstack/react-router";
import { formattedDate } from "@/lib/date";
import { getNoShowHearings } from "@/lib/hearing";
import { useHearing } from "@/store/hearing";

export const Route = createFileRoute("/$caseId/hearings/")({
	component: RouteComponent,
});

function RouteComponent() {
	const hearingDataList = useHearing((state) => state.hearingDataList);
	console.log("data from index.tsx: ", hearingDataList);
	const noShowHearings = getNoShowHearings(hearingDataList);
	return (
		<div className="m-2 w-full">
			<h1 className="text-center">Overview</h1>
			<ul className="list-disc list-inside">
				<li>쌍방 불출석한 기일</li>
				<ol className="list-decimal list-inside pl-3">
					{noShowHearings.map((h) => (
						<li key={h.id}>
							{formattedDate(h.hearingDate)} {h.hearingTime}
						</li>
					))}
				</ol>
			</ul>
		</div>
	);
}
