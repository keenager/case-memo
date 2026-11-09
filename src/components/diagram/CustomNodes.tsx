import {
  type BuiltInNode,
  Handle,
  type Node,
  type NodeProps,
  Position,
} from "@xyflow/react";
import { CLAIM_CATEGORIES, type ClaimCategory } from "@/lib/diagram/types";
import { Badge } from "../ui/badge";
import { Item, ItemContent, ItemDescription, ItemHeader } from "../ui/item";

export const nodeTypes = { plaintiff: PlaintiffNode, defendant: DefendantNode };
export type CustomNode = Node<{ category: ClaimCategory; content: string }, keyof typeof nodeTypes >;
export type CustomNodeType = BuiltInNode | CustomNode;

export function PlaintiffNode({ data }: NodeProps<CustomNode>) {
  return (
    <div>
      <Item
        variant="outline"
        size="default"
        className="flex flex-col gap-1 px-2 py-1"
      >
        <ItemHeader className="w-full">
          <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
            {CLAIM_CATEGORIES[data.category]}
          </Badge>
        </ItemHeader>
        <ItemContent>
          <ItemDescription className="text-lg">{data.content}</ItemDescription>
        </ItemContent>
      </Item>
      <Handle
        type="target"
        position={Position.Right}
        id="plaintiff-target"
        style={{ top: "33%" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="plaintiff-source"
        style={{ top: "66%" }}
      />
    </div>
  );
}

export function DefendantNode({ data }: NodeProps<CustomNode>) {
  return (
    <div>
      <Item
        variant="outline"
        size="sm"
        className="flex flex-col gap-1 px-2 py-1"
      >
        <ItemHeader className="w-full">
          <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {CLAIM_CATEGORIES[data.category]}
          </Badge>
        </ItemHeader>
        <ItemContent>
          <ItemDescription className="text-lg">{data.content}</ItemDescription>
        </ItemContent>
      </Item>
      <Handle
        type="source"
        position={Position.Left}
        id="defendant-source"
        style={{ top: "33%" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="defendant-target"
        style={{ top: "66%" }}
      />
    </div>
  );
}
