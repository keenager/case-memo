import type { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react/menus";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { PARTIES } from "@/lib/commonType";
import {
	CLAIM_CATEGORIES,
	type FlowNodeWithContent,
} from "@/lib/diagram/types";
import { useFlow } from "@/store/diagram";
import { useBubbleMenu } from "./useBubbleMenu";

export default function BubbleMenuForDiagram({ editor }: { editor: Editor }) {
	const currentFlowNodesWithContents = useFlow(
		(state) => state.currentFlowNodesWithContents,
	);
	const {
		isUpdate,
		initNode,
		selectedNode,
		setSelectedNode,
		showHandler,
		submitHandler,
	} = useBubbleMenu({ editor });

	const Additional = ({
		category,
		parentList,
	}: {
		category: "ground" | "element" | "defense";
		parentList: FlowNodeWithContent[];
	}) => {
		return (
			<>
				<Separator orientation="vertical" />
				<FieldSet>
					<FieldLegend>
						소속 {category === "element" ? "청구원인" : "청구취지"}
					</FieldLegend>
					<Separator />
					<RadioGroup
						value={selectedNode.parentId}
						onValueChange={(value) => {
							setSelectedNode((prev) => ({ ...prev, parentId: value }));
						}}
					>
						{parentList.map((parent) => (
							<Field key={parent.id} orientation="horizontal">
								<RadioGroupItem value={parent.id} id={parent.id.toString()} />
								<FieldLabel htmlFor={parent.id.toString()}>
									{parent.content}
								</FieldLabel>
							</Field>
						))}
					</RadioGroup>
				</FieldSet>
			</>
		);
	};

	const parties = [PARTIES[0], PARTIES[2]];

	return (
		<BubbleMenu
			editor={editor}
			className="border rounded-md bg-white"
			options={{
				placement: "right",
				onShow: showHandler,
				onHide: () => {
					setSelectedNode(initNode);
				},
			}}
		>
			<form className="flex flex-col" onSubmit={submitHandler}>
				<div className="mt-2 mx-2 flex gap-3">
					<FieldSet>
						<FieldLegend>당사자</FieldLegend>
						<Separator />
						<RadioGroup
							value={selectedNode.party}
							onValueChange={(value) => {
								setSelectedNode((prev) => ({ ...prev, party: value }));
							}}
						>
							{parties.map((party) => (
								<Field key={party.id} orientation="horizontal">
									<RadioGroupItem value={party.value} id={party.id} />
									<FieldLabel htmlFor={party.id}>{party.label}</FieldLabel>
								</Field>
							))}
						</RadioGroup>
					</FieldSet>
					<Separator orientation="vertical" />
					<FieldSet>
						<FieldLegend>주장의 종류</FieldLegend>
						<Separator />
						<RadioGroup
							value={selectedNode.category}
							onValueChange={(value) => {
								setSelectedNode((prev) => ({ ...prev, category: value }));
							}}
						>
							{Object.entries(CLAIM_CATEGORIES).map(([key, value]) => (
								<Field key={key} orientation="horizontal">
									<RadioGroupItem value={key} id={key} />
									<FieldLabel htmlFor={key}>{value}</FieldLabel>
								</Field>
							))}
						</RadioGroup>
					</FieldSet>
					{selectedNode.category === "ground" && (
						<Additional
							category={selectedNode.category}
							parentList={currentFlowNodesWithContents.filter(
								(n) => n.category === "relief",
							)}
						/>
					)}
					{selectedNode.category === "element" && (
						<Additional
							category={selectedNode.category}
							parentList={currentFlowNodesWithContents.filter((n) =>
								selectedNode.party === "plaintiff"
									? n.category === "ground" ||
										(n.party === "plaintiff" && n.category === "defense")
									: n.category === "defense",
							)}
						/>
					)}
					{selectedNode.party === "plaintiff" &&
						selectedNode.category === "defense" && (
							<Additional
								category={selectedNode.category}
								parentList={currentFlowNodesWithContents.filter(
									(n) => n.category === "relief",
								)}
							/>
						)}
				</div>
				<Separator />
				<div className="flex justify-center">
					<Button className="my-1" type="submit">
						{isUpdate ? "수정" : "만들기"}
					</Button>
				</div>
			</form>
		</BubbleMenu>
	);
}
