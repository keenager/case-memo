import type { CustomNodeType } from "@/components/diagram/CustomNodes";
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

const getFamilies = (nodeList: FlowNodeWithContent[]) =>
	// {부모 id: 자식 노드[]}
	nodeList.reduce<Record<number, FlowNodeWithContent[]>>((acc, val, _) => {
		if (val.parentId) {
			const curChildren = acc[val.parentId];
			acc[val.parentId] = curChildren ? [...curChildren, val] : [val];
			return acc;
		} else {
			return acc;
		}
	}, {});

const nodeWidthOffset = 30;
const nodeWidth: Record<ClaimCategory, number> = {
	relief: 340,
	get ground() {
		return this.relief - nodeWidthOffset * 2;
	},
	get element() {
		return this.ground - nodeWidthOffset * 2;
	},
	get defense() {
		return this.ground;
	},
	get admit() {
		return this.ground;
	},
};

type PlaceProps = {
	node: FlowNodeWithContent;
	depthX: number;
	depthY: number;
	style?: React.CSSProperties | undefined;
};

const nodesClassified: CustomNodeType[] = [];
//  const nodesUnclassified = [];

const placeNode = ({ node, depthX, depthY, style }: PlaceProps) => {
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
		data: { category: node.category, content: node.content },
	} as CustomNodeType;
	// console.log("newNode: ", newNode);
	if (existIdx < 0) {
		nodesClassified.push(newNode);
	} else {
		nodesClassified.splice(existIdx, 1, newNode);
	}
};

const circulate = (
	nodeList: FlowNodeWithContent[],
	parentsChildren: Record<number, FlowNodeWithContent[]>,
	cordYList: { [k: string]: number } = { relief: 0, defense: 0 },
) => {
	nodeList.forEach((node) => {
		const keys = Object.keys(cordYList);
		for (let i = 0; i < keys.length; i++) {
			cordYList[keys[i]] += 1;
		}
		cordYList[`inner-${node.category}`] = 0; // innerY
		// console.log("node, cordYList", node, cordYList);
		const children = parentsChildren[node.id] as
			| FlowNodeWithContent[]
			| undefined;
		// const categoryIdx = Object.keys(CLAIM_CATEGORIES).indexOf(node.category);
		const style: PlaceProps["style"] = children && {
			width: nodeWidth[node.category],
			height: (children.length + 1) * 70,
			border: "solid",
			borderWidth: 1,
			borderRadius: 10,
		};
		const nodeInfo: PlaceProps = {
			node,
			depthX:
				node.party === "plaintiff"
					? node.parentId
						? 1
						: 0
					: node.parentId
						? 1
						: 15,
			depthY: cordYList[`${node.category}`],
			style,
		};
		placeNode(nodeInfo);
		if (children) {
			cordYList[`${children[0].category}`] = 0; // childrenY
			circulate(children, parentsChildren, cordYList);
			nodeInfo.style!.height = (cordYList[`inner-${node.category}`] + 1) * 70;
			// console.log("node, cordYList", node, cordYList);
			placeNode(nodeInfo);
		}
	});
};

export const classifyNodes = (nodeList: FlowNodeWithContent[]) => {
	const parentsChildren = getFamilies(nodeList);
	const reliefList = nodeList.filter((n) => n.category === "relief");
	const defenseList = nodeList.filter(
		(n) => n.category === "defense" && n.party === "defendant",
	);

	circulate(reliefList, parentsChildren);
	circulate(defenseList, parentsChildren);
	console.log("nodesClassified: ", nodesClassified);

	return nodesClassified;
};
