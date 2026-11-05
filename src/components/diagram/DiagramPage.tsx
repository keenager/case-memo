import { Background, Controls, MarkerType, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useDiagrams } from "@/lib/diagram/useDiagrams";
import { Button } from "../ui/button";
import { DefendantNode, PlaintiffNode } from "./CustomNodes";

const nodeTypes = { plaintiff: PlaintiffNode, defendant: DefendantNode };
// const edgeTypes = { custom: CustomEdge };

export default function DiagramPage() {
  const { saveHandler, ...props } = useDiagrams();
  return (
    <>
      <Button onClick={saveHandler}>저장</Button>
      <div style={{ width: "100%", height: "90%" }}>
        <ReactFlow
          {...props}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{
            markerEnd: { type: MarkerType.Arrow, height: 50, width: 50 },
          }}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
}
