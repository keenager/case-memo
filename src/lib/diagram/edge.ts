import type { Edge } from "@xyflow/react";
import type { CustomNodeType } from "@/components/diagram/CustomNodes";
import type { FlowEdge } from "./types";

export const makeCustomEdgeFn = (edge: FlowEdge): Edge => ({
	id: `${edge.sourceId}-${edge.targetId}`,
	source: edge.sourceId.toString(),
	target: edge.targetId.toString(),
});

export const getTargetsSources = (edgeList: Edge[]) => {
	// {targetId: edge[]}

	const obj = edgeList.reduce<Record<string, Edge[]>>((acc, val) => {
		const curSource = acc[val.target];
		acc[val.target] = curSource ? [...curSource, val] : [val];
		return acc;
	}, {});
	const filtered = Object.fromEntries(
		Object.entries(obj).filter(([_, edges]) => edges.length > 1),
	);
	return filtered;
};

export const adjustDefencesHeight = (
	edges: Edge[],
	nodes: CustomNodeType[],
) => {
	const targetsSources = getTargetsSources(edges);

	edges.forEach((edge) => {
		const sourceNodeToAdj = nodes.find(
			(n) => n.id === edge.source && n.type === "defendant",
		);
		const targetNode = nodes.find((n) => n.id === edge.target);
		if (!sourceNodeToAdj || !targetNode) return;

		// target과 같은 높이로 이동
		const parentOfTarget = nodes.find((n) => n.id === targetNode.parentId);

		if (targetNode.parentId && parentOfTarget) {
			sourceNodeToAdj.position.y =
				parentOfTarget.position.y + targetNode.position.y;
		} else {
			sourceNodeToAdj.position.y = targetNode.position.y;
		}

		// target이 같은 node가 여럿인 경우
		if (Object.keys(targetsSources).includes(targetNode.id)) {
			const sourcesWithSameTarget = targetsSources[targetNode.id];
			const curIdx = sourcesWithSameTarget.findIndex(
				(edge) => edge.source === sourceNodeToAdj.id,
			);

			if (curIdx > 0) {
				let height = 0;
				for (let i = 0; i < curIdx; i++) {
					const prevSourceNode = nodes.find(
						(n) => n.id === sourcesWithSameTarget[i].source,
					);
					const prevHeight =
						(prevSourceNode?.style?.height as number | undefined) ?? 0;
					height += prevHeight;
				}
				sourceNodeToAdj.position.y += height;
			}
		}
	});
};
