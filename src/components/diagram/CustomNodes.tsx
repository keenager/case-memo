import {
	type BuiltInNode,
	Handle,
	type Node,
	type NodeProps,
	Position,
} from "@xyflow/react";
import { Item, ItemContent, ItemDescription } from "../ui/item";

type CustomNode = Node<{ label: string }, "aaa">;
export type CustomNodeType = BuiltInNode | CustomNode;

export function PlaintiffNode({ data }: NodeProps<CustomNode>) {
	return (
		<div>
			<Item variant="outline" size="sm">
				<ItemContent>
					<ItemDescription>{data.label}</ItemDescription>
				</ItemContent>
			</Item>
			<Handle type="target" position={Position.Right} />
		</div>
	);
}

export function DefendantNode({ data }: NodeProps<CustomNode>) {
	return (
		<div>
			<Item variant="outline" size="sm">
				<ItemContent>
					<ItemDescription>{data.label}</ItemDescription>
				</ItemContent>
			</Item>
			<Handle type="source" position={Position.Left} />
		</div>
	);
}
