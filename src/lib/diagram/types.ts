export const PARTIES = [
	{ id: "plaintiff", value: "plaintiff", label: "원고" },
	{ id: "defendant", value: "defendant", label: "피고" },
] as const;
export type Party = (typeof PARTIES)[number]["value"];

export const CLAIM_CATEGORIES = [
	{ id: "relief", value: "relief", label: "청구취지" },
	{ id: "ground", value: "ground", label: "청구원인" },
	{ id: "adimt", value: "adimt", label: "자백" },
	{ id: "defense", value: "defense", label: "항변" },
	{ id: "element", value: "element", label: "요건사실" },
] as const;
export type ClaimCategory = (typeof CLAIM_CATEGORIES)[number]["value"];

export type FlowNode = {
	id: number;
	memoId: number;
	paraId: string;
	party: "plaintiff" | "defendant";
	category: ClaimCategory;
	parent?: number;
};
export type FlowNodeWithContent = FlowNode & { content: string };

export type FlowEdge = {
	id?: number;
	memoId: number;
	sourceId: number;
	targetId: number;
	label?: string;
};
