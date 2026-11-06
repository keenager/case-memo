import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	type Edge,
	type OnConnect,
	type OnEdgesChange,
	type OnNodesChange,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";
import type { CustomNodeType } from "@/components/diagram/CustomNodes";
import { getDB } from "@/lib/db/db";
import { makeCustomEdgeFn } from "@/lib/diagram/edge";
import { classifyNodes, getFlowNodesWithContents } from "@/lib/diagram/node";
import type { FlowEdge, FlowNodeWithContent } from "@/lib/diagram/types";
import { handleError } from "@/lib/error";
import { useFlow } from "@/store/diagram";
import { useMemo } from "@/store/memo";

const initialNodes: CustomNodeType[] = [
	{
		id: "n1",
		// type: "plaintiff",
		position: { x: 0, y: 0 },
		data: { label: "Node 1" },
	},
	{ id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges: Edge[] = [
	{
		id: "n1-n2",
		source: "n1",
		target: "n2",
		// type: "smoothstep",
		label: "connectWith",
		markerEnd: "arrow",
	},
];

export const useDiagrams = () => {
	const currentMemoId = useMemo((state) => state.currentMemoId);
	const loadedNodes = useFlow((state) => state.currentFlowNodes);
	const setCurrentFlowNodesWithContents = useFlow(
		(state) => state.setCurrentFlowNodesWithContents,
	);
	const loadedEdges = useFlow((state) => state.currentFlowEdges);

	const [nodes, setNodes] = useState<CustomNodeType[]>(initialNodes);
	const [edges, setEdges] = useState<Edge[]>(initialEdges);

	const onNodesChange: OnNodesChange<CustomNodeType> = useCallback(
		(changes) =>
			setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
		[],
	);
	const onEdgesChange: OnEdgesChange = useCallback(
		(changes) =>
			setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
		[],
	);
	const onConnect: OnConnect = useCallback(
		(params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
		[],
	);

	useEffect(() => {
		// console.log("loadedNodes: ", loadedNodes);
		// console.log("loadedEdges: ", loadedEdges);

		if (loadedNodes.length === 0) return;
		const targetTags = document
			.querySelector(".tiptap")
			?.querySelectorAll("[data-id]");
		if (!targetTags) return;

		// 위에서 return 처리를 했기 때문에 flowNodesWithContents에는 뭔가가 있음이 보장됨.
		const flowNodesWithContents: FlowNodeWithContent[] =
			getFlowNodesWithContents(loadedNodes, targetTags);
		console.log("flowNodesWithContents: ", flowNodesWithContents);

		const nodes = classifyNodes(flowNodesWithContents);
		const edges = loadedEdges?.map<Edge>(makeCustomEdgeFn) ?? [];
		// console.log(edges);

		// 피고 항변의 위치 조정
		edges.forEach((edge) => {
			const sourceNodeToAdj = nodes.find(
				(n) => n.id === edge.source && n.type === "defendant",
			);
			const targetNode = nodes.find((n) => n.id === edge.target);
			if (!sourceNodeToAdj || !targetNode) return;

			const parent = nodes.find((n) => n.id === targetNode.parentId);
			if (targetNode.parentId && parent) {
				sourceNodeToAdj.position.y = parent.position.y + targetNode.position.y;
			} else {
				sourceNodeToAdj.position.y = targetNode.position.y;
			}
		});

		setNodes(nodes);
		setCurrentFlowNodesWithContents(flowNodesWithContents);
		setEdges(edges);
	}, [loadedNodes, setCurrentFlowNodesWithContents, loadedEdges]);

	const saveHandler = async () => {
		console.log("nodes: ", nodes);
		console.log("edges: ", edges);
		if (!currentMemoId) return;

		const flowEdges = edges.map<FlowEdge>((e) => ({
			memoId: currentMemoId,
			sourceId: +e.source,
			targetId: +e.target,
			label: e.label?.toString(),
		}));
		try {
			const db = await getDB();
			for (let i = 0; i < flowEdges.length; i++) {
				const values = Object.values(flowEdges[i]);
				const exist = await db.select<FlowEdge[]>(
					`SELECT * FROM flow_edges WHERE memo_id = $1 AND source_id = $2 AND target_id = $3`,
					[...values.slice(0, -1)],
				);
				if (exist.length > 0) continue;

				await db.execute(
					`INSERT INTO flow_edges (memo_id, source_id, target_id, label) VALUES ($1, $2, $3, $4)`,
					[...values],
				);
			}
		} catch (error) {
			handleError(error);
		}
	};

	return { nodes, edges, onNodesChange, onEdgesChange, onConnect, saveHandler };
};
