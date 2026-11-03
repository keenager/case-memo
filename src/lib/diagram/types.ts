export const PARTIES = [
	{ id: "plaintiff", value: "plaintiff", label: "원고" },
	{ id: "defendant", value: "defendant", label: "피고" },
] as const;
export type Party = (typeof PARTIES)[number]["value"];

export const CLAIM_CATEGORIES = {
	relief: "청구취지",
	ground: "청구원인",
	admit: "자백",
	defense: "항변",
	element: "요건사실",
} as const;

// export const CLAIM_CATEGORIES = [
// 	{ id: "relief", value: "relief", label: "청구취지" },
// 	{ id: "ground", value: "ground", label: "청구원인" },
// 	{ id: "admit", value: "admit", label: "자백" },
// 	{ id: "defense", value: "defense", label: "항변" },
// 	{ id: "element", value: "element", label: "요건사실" },
// ] as const;
export type ClaimCategory = keyof typeof CLAIM_CATEGORIES;
export type ClaimCategoryLabel = (typeof CLAIM_CATEGORIES)[ClaimCategory];

export type FlowNode = {
	id: number;
	memoId: number;
	paraId: string;
	party: "plaintiff" | "defendant";
	category: ClaimCategory;
	parentId?: number;
};
export type FlowNodeWithContent = FlowNode & { content: string };

export type FlowEdge = {
	id?: number;
	memoId: number;
	sourceId: number;
	targetId: number;
	label?: string;
};
