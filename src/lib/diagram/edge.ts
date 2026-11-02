import { type Edge, MarkerType } from "@xyflow/react";
import type { FlowEdge } from "./types";

export const makeCustomEdgeFn = (edge: FlowEdge): Edge => ({
	id: `${edge.sourceId}-${edge.targetId}`,
	source: edge.sourceId.toString(),
	target: edge.targetId.toString(),
	markerEnd: { type: MarkerType.Arrow },
});
