import type { Edge } from "@xyflow/react";
import type { ClaimCategory, FlowNode, FlowNodeWithContent } from "./types";

export const getFlowNodesWithContents = (
	diagrams: FlowNode[],
	targetTags: NodeListOf<Element>,
) => {
	const tagsArr = Array.from(targetTags);

	const result = diagrams.flatMap((d) => {
		const tag = tagsArr.find((t) => t.getAttribute("data-id") === d.paraId);
		// flatMap에서 이렇게 하면 건너뜀
		if (!tag) return [];
		return { ...d, content: tag.textContent };
	});
	return result;
};

export const makeCustomNodeFn =
	(edges: Edge[]) =>
	(n: FlowNodeWithContent, idx: number, nodes: FlowNodeWithContent[]) => {
		return {
			id: n.id.toString(),
			type: n.party,
			position: getPosition(n, idx, nodes, edges),
			data: { label: n.content },
		};
	};

type Coordinate = { x: number; y: number };
// type Position = Record<ClaimCategory, Coordinate>;

// const position: Position = { relief: { x: 0, y: 0 }, ground: { x: 20, y: 50 }, defense: {x: } };

const getPosition = (
	n: FlowNodeWithContent,
	idx: number,
	nodes: FlowNodeWithContent[],
	edges: Edge[],
): Coordinate => {
	const position = { x: 0, y: 0 };
	if (n.party === "plaintiff") {
		if (n.category === "ground") position.x += 20;
		else if (n.category === "element") {
			position.x += 40;
		}

		if (n.category === "defense") position.y += 300;
		position.y += idx * 50;

		return position;
		//  {
		// 	x:
		// 		n.category === "relief"
		// 			? 0
		// 			: n.category === "ground"
		// 				? 20
		// 				: n.category === "element"
		// 					? 40
		// 					: 300,
		// 	y: 0 + idx * 50,
		// };
	} else {
		position.x += 300;
		return position;
	}
};
