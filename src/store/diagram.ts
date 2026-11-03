import { create } from "zustand";
import type {
	FlowEdge,
	FlowNode,
	FlowNodeWithContent,
} from "@/lib/diagram/types";

type State = {
	currentFlowNodes: FlowNode[];
	currentFlowNodesWithContents: FlowNodeWithContent[];
	currentFlowEdges: FlowEdge[];
};
type Action = {
	setCurrentFlowNodes: (newNodes: FlowNode[]) => void;
	addNewFlowNode: (newNode: FlowNode)=>void;
	setCurrentFlowNodesWithContents: (newNodes: FlowNodeWithContent[]) => void;
	setCurrentFlowEdges: (newEdges: FlowEdge[]) => void;
};

export const useFlow = create<State & Action>((set) => ({
	currentFlowNodes: [],
	setCurrentFlowNodes: (newNodes: FlowNode[]) => {
		set({ currentFlowNodes: newNodes });
	},
	addNewFlowNode: (newNode: FlowNode) => {set((state)=>({ currentFlowNodes: [...state.currentFlowNodes, newNode] }))}
	,
	currentFlowNodesWithContents: [],
	setCurrentFlowNodesWithContents: (newNodes: FlowNodeWithContent[]) => {
		set({ currentFlowNodesWithContents: newNodes });
	},
	currentFlowEdges: [],
	setCurrentFlowEdges: (newEdges: FlowEdge[]) => {
		set({ currentFlowEdges: newEdges });
	},
}));
