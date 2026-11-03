import type { CustomNodeType } from "@/components/diagram/CustomNodes";
import type { FlowNode, FlowNodeWithContent } from "./types";

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

export const classifyNodes = (flowNodesWithContents: FlowNodeWithContent[]) => {
	// {부모 id: 자식 노드[]}
	const parentsChildren = flowNodesWithContents.reduce<
		Record<number, FlowNodeWithContent[]>
	>((acc, val, _) => {
		if (val.parentId) {
			const curChildren = acc[val.parentId];
			acc[val.parentId] = curChildren ? [...curChildren, val] : [val];
			return acc;
		} else {
			return acc;
		}
	}, {});
	console.log("parentsChildren: ", parentsChildren);

	const nodesClassified: CustomNodeType[] = [];
	//  const nodesUnclassified = [];
	let depthX = 0,
		depthY = 0;

	const place = (node: FlowNodeWithContent, depthX: number, depthY: number) => {
		nodesClassified.push({
			id: node.id.toString(),
			type: node.party,
			position: { x: depthX * 30, y: depthY * 70 },
			data: { label: node.category, content: node.content },
		} as CustomNodeType);
	};

	const reliefList = flowNodesWithContents.filter(
		(n) => n.category === "relief",
	);
	reliefList.forEach((relief) => {
		depthY++;
		place(relief, depthX, depthY);
		const grounds: FlowNodeWithContent[] | undefined =
			parentsChildren[relief.id];
		if (!grounds) return;
		depthX++;
		grounds.forEach((ground) => {
			depthY++;
			place(ground, depthX, depthY);
			const elementsAndRedefenses = parentsChildren[ground.id];
			if (!elementsAndRedefenses) return;
			const sortedList = [
				...elementsAndRedefenses.filter((n) => n.category === "element"),
				...elementsAndRedefenses.filter((n) => n.category === "defense"),
			];
			depthX++;
			sortedList.forEach((el) => {
				depthY++;
				place(el, depthX, depthY);
				if (el.category === "defense") {
					const elementsForRedefense = parentsChildren[el.id];
					if (!elementsForRedefense) return;
					depthX++;
					elementsForRedefense.forEach((el) => {
						depthY++;
						place(el, depthX, depthY);
					});
					depthX--;
				}
			});
			depthX--;
		});

		depthX--;
	});
	console.log("nodesClassified: ", nodesClassified);

	depthX = 10;
	depthY = 0;
	const defenseList = flowNodesWithContents.filter(
		(n) => n.category === "defense",
	);
	defenseList.forEach((defense) => {
		//원고의 재항변은 건너뛰기
		if (defense.party === "plaintiff") return;

		depthY++;
		place(defense, depthX, depthY);
		const elements = parentsChildren[defense.id];
		if (!elements) return;
		depthX++;
		elements.forEach((el) => {
			depthY++;
			place(el, depthX, depthY);
		});
		depthX--;
	});
	return nodesClassified;
};
