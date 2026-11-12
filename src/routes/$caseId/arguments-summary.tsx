import { createFileRoute } from "@tanstack/react-router";
import DiagramPage from "@/components/diagram/DiagramPage";
import MemoEditor from "@/components/editor/MemoEditor";
import MemoLayout, {
	type MemoLayoutProps,
} from "@/components/section-detail/MemoLayout";
import {
	getCaseNumber,
	getFlowEdges,
	getFlowNodes,
	getMemo,
} from "@/lib/db/read";
import { SECTIONS } from "@/lib/sections";
import { useFlow } from "@/store/diagram";
import { useMemo } from "@/store/memo";

export const Route = createFileRoute("/$caseId/arguments-summary")({
	loader: async ({ params }) => {
		const caseNumber = await getCaseNumber(+params.caseId);
		const loadedMemo = await getMemo({
			caseId: params.caseId,
			sectionCategory: "arguments-summary",
		});
		const contents = loadedMemo?.contents;
		// memo의 id를 스토어에 저장
		useMemo.setState({ currentMemoId: loadedMemo?.id });
		// console.log("loadedMemo?.id: ", loadedMemo?.id);

		// 해당 메모에서 저장된 react flow 정보 불러오기
		const flowNodes = await getFlowNodes(loadedMemo?.id);
		const flowEdges = await getFlowEdges(loadedMemo?.id);
		// console.log("flowNodes from db: ", flowNodes);
		// console.log("flowEdges from db: ", flowEdges);
		useFlow.setState({
			currentFlowNodes: flowNodes,
			currentFlowEdges: flowEdges,
		});
		return { caseNumber, contents };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { caseNumber, contents } = Route.useLoaderData();
	const props: MemoLayoutProps = {
		caseNumber,
		sectionName: SECTIONS["arguments-summary"].title,
	};
	return (
		<div className="flex-1 flex">
			<MemoLayout {...props}>
				<MemoEditor
					caseId={Route.useParams().caseId}
					sectionCategory="arguments-summary"
					contents={contents}
				/>
			</MemoLayout>
			<div className="flex-1 m-2 flex flex-col">
				<div className="text-center">관계도</div>
				<div className="grow">
					<DiagramPage />
				</div>
			</div>
		</div>
	);
}
