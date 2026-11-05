import React from "react";
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

	type PlaceProps = {
		node: FlowNodeWithContent;
		depthX: number;
		depthY: number;
		style?: React.CSSProperties | undefined;
	};
	const place = ({ node, depthX, depthY, style }: PlaceProps) => {
		const existIdx = nodesClassified.findIndex(
			(prev) => prev.id === node.id.toString(),
		);
		const newNode = {
			id: node.id.toString(),
			type: node.party,
			position: {
				x: depthX * 30,
				y: depthY * 70,
			},
			style: style,
			parentId: node.parentId?.toString(),
			extent: node.parentId && "parent",
			data: { label: node.category, content: node.content },
		} as CustomNodeType;
		if (existIdx < 0) {
			nodesClassified.push(newNode);
		} else {
			nodesClassified.splice(existIdx, 1, newNode);
		}
	};

	const reliefList = flowNodesWithContents.filter(
		(n) => n.category === "relief",
	);
	let reliefY = 0;
	reliefList.forEach((relief, idx) => {
		reliefY++;
		let innerReliefY = 0;
		const grounds = parentsChildren[relief.id] as
			| FlowNodeWithContent[]
			| undefined;

		const styleForRelief: PlaceProps["style"] = grounds && {
			width: 250,
			height: (grounds.length + 1) * 70,
			border: "solid",
			borderWidth: 1,
			borderRadius: 10,
		};
		const reliefInfo: PlaceProps = {
			node: relief,
			depthX: 0,
			depthY: reliefY,
			style: styleForRelief,
		};

		console.log("reliefY: ", reliefY);
		place(reliefInfo);

		if (!grounds) return;
		let groundY = 0;
		grounds.forEach((ground, idx) => {
			reliefY++;
			innerReliefY++;
			groundY++;
			const elementsAndRedefenses = parentsChildren[ground.id] as
				| FlowNodeWithContent[]
				| undefined;
			const elements = elementsAndRedefenses?.filter(
				(n) => n.category === "element",
			);
			const redefenses = elementsAndRedefenses?.filter(
				(n) => n.category === "defense",
			);
			const styleForGround: PlaceProps["style"] = elements &&
				redefenses && {
					width: 200,
					height: (elements.length + redefenses.length + 1) * 70,
					border: "solid",
					borderWidth: 1,
					borderRadius: 10,
				};
			const groundInfo: PlaceProps = {
				node: ground,
				depthX: 1,
				depthY: groundY,
				style: styleForGround,
			};
			place(groundInfo);

			if (!elements || !redefenses) return;

			let innderGroundY = 0;
			elements.forEach((element, idx) => {
				reliefY++;
				innerReliefY++;
				groundY++;
				innderGroundY++;
				place({ node: element, depthX: 1, depthY: innderGroundY });
			});
			redefenses.forEach((redef) => {
				reliefY++;
				innerReliefY++;
				groundY++;
				innderGroundY++;
				const elements = parentsChildren[redef.id] as
					| FlowNodeWithContent[]
					| undefined;
				const styleForRedef: PlaceProps["style"] = elements && {
					width: 180,
					height: (elements.length + 1) * 70,
					border: "solid",
					borderWidth: 1,
					borderRadius: 10,
				};
				const redefInfo: PlaceProps = {
					node: redef,
					depthX: 1,
					depthY: innderGroundY,
					style: styleForRedef,
				};
				place(redefInfo);
				if (!elements) return;
				elements.forEach((element, idx) => {
					reliefY++;
					innerReliefY++;
					groundY++;
					innderGroundY++;
					place({ node: element, depthX: 1, depthY: idx + 1 });
				});
			});

			// place(ground, depthX, depthY);
			// if (!elementsAndRedefenses) return;
			// depthX++;
			// sortedList.forEach((el) => {
			// 	depthY++;
			// 	place(el, depthX, depthY);
			// 	if (el.category === "defense") {
			// 		const elementsForRedefense = parentsChildren[el.id];
			// 		if (!elementsForRedefense) return;
			// 		depthX++;
			// 		elementsForRedefense.forEach((el) => {
			// 			depthY++;
			// 			place(el, depthX, depthY);
			// 		});
			// 		depthX--;
			// 	}
			// });
			// depthX--;
			groundInfo.style!.height = (innderGroundY + 1) * 70;
			place(groundInfo);
			// console.log("groundInfo:", groundInfo);
		});

		// 그동안 누적된 y 깊이로 높이를 다시 계산해서 배치
		// if (idx === reliefList.length - 1 && style) {
		// 	style.height = (depthY + 1) * 70;
		// }
		reliefInfo.style!.height = (innerReliefY + 1) * 70;
		place(reliefInfo);
		// reliefYPrev = reliefY;
	});
	console.log("nodesClassified: ", nodesClassified);

	let defenseX = 15,
		defenseY = 0;
	const defenseList = flowNodesWithContents.filter(
		(n) => n.category === "defense" && n.party === "defendant",
	);
	defenseList.forEach((defense) => {
		defenseY++;
		const elements = parentsChildren[defense.id] as
			| FlowNodeWithContent[]
			| undefined;
		const styleForDefense: PlaceProps["style"] = elements && {
			width: 250,
			height: (elements.length + 1) * 70,
			border: "solid",
			borderWidth: 1,
			borderRadius: 10,
		};
		const defenseInfo: PlaceProps = {
			node: defense,
			depthX: defenseX,
			depthY: defenseY,
			style: styleForDefense,
		};
		place(defenseInfo);
		if (!elements) return;
		let elementsY = 0;
		elements.forEach((element, idx) => {
			defenseY++;
			elementsY++;
			place({ node: element, depthX: 1, depthY: elementsY });
		});
	});
	return nodesClassified;
};
