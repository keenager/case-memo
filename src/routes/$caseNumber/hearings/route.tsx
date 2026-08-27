import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/$caseNumber/hearings")({
	component: RouteComponent,
});

function RouteComponent() {
	const { caseNumber } = Route.useParams();
	return (
		<div className="flex-1 overflow-y-auto flex">
			<div className="w-48 border-r text-center flex flex-col">
				<p className="py-2">기일</p>
				<Separator className="mb-2" />
				{hearingList.map((date, idx) => (
					<Link
						key={date}
						to="/$caseNumber/hearings/$hearingsId"
						params={{ caseNumber, hearingsId: date }}
					>
						<p>
							{idx + 1}차 {date}
						</p>
						<Separator className="my-2" />
					</Link>
				))}
			</div>
			{/* <div>Hello "/$caseNumber/hearings"!</div> */}
			<Outlet />
		</div>
	);
}

const hearingList = ["2023-01-01", "2023-02-01", "2023-03-01"];
