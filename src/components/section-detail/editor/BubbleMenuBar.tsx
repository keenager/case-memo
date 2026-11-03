import type { QueryResult } from "@tauri-apps/plugin-sql";
import type { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react/menus";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { getDB } from "@/lib/db/db";
import {
  CLAIM_CATEGORIES,
  //   type ClaimCategory,
  type FlowNode,
  type FlowNodeWithContent,
  PARTIES,
  //   type Party,
} from "@/lib/diagram/types";
import { handleError } from "@/lib/error";
import { useFlow } from "@/store/diagram";
import { useMemo } from "@/store/memo";

export default function BubbleMenuBar({ editor }: { editor: Editor }) {
  const currentMemoId = useMemo((state) => state.currentMemoId);
  const currentFlowNodesWithContents = useFlow(
    (state) => state.currentFlowNodesWithContents,
  );
  const addNode = useFlow((state) => state.addNewFlowNode);

  const [isUpdate, setIsUpdate] = useState(false);
  const initNode: FlowNode = {
    id: 0,
    party: "plaintiff",
    category: "relief",
    memoId: 0,
    paraId: "",
  };
  const [selectedNode, setSelectedNode] = useState<FlowNode>(initNode);

  const showHandler = async () => {
    const { $anchor } = editor.state.selection;
    const paraId = $anchor.node().attrs.id as string;
    try {
      const db = await getDB();
      const [result] = (await db.select(
        `SELECT * FROM flow_nodes WHERE memo_id = $1 AND para_id = $2`,
        [currentMemoId, paraId],
      )) as FlowNode[];
      if (result) {
        setIsUpdate(true);
        setSelectedNode(result);
      } else {
        setIsUpdate(false);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const hideHandler = () => {
    setSelectedNode(initNode);
  };

  const submitHandler = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const node = editor.state.selection.$anchor.node();
    const nodeName = node.type.name;
    // editor.getAttributes()는 현재 선택된 노드를 대상으로 함.
    const paraId = editor.getAttributes(nodeName).id;
    // console.log({ currentMemoId, paraId, party, category, parentId });

    const { party, category, parentId } = selectedNode;

    try {
      let result: QueryResult;
      const db = await getDB();
      if (isUpdate) {
        result = await db.execute(
          `UPDATE flow_nodes 
                    SET party = $1, category = $2, parent_id = $3
                    WHERE memo_id = $4 AND para_id = $5`,
          [party, category, parentId, currentMemoId, paraId],
        );
      } else {
        result = await db.execute(
          `
                    INSERT INTO flow_nodes (memo_id, para_id, party, category, parent_id) VALUES ($1, $2, $3, $4, $5)
                    `,
          [currentMemoId, paraId, party, category, parentId],
        );
      }
      console.log(result);
      const newFlowNode: FlowNodeWithContent = {
        id: isUpdate ? 0 : (result.lastInsertId ?? 0),
        memoId: currentMemoId ?? 0,
        paraId,
        party,
        category,
        parentId,
        content: node.textContent,
      };
      addNode(newFlowNode);

      // 메뉴 감추기
      editor.commands.setTextSelection(editor.state.selection.to);
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <BubbleMenu
      editor={editor}
      className="border rounded-md bg-white"
      options={{ placement: "right", onShow: showHandler, onHide: hideHandler }}
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
              {PARTIES.map((party) => (
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
          {(selectedNode.category === "ground" ||
            selectedNode.category === "element" ||
            (selectedNode.party === "plaintiff" &&
              selectedNode.category === "defense")) && (
            <>
              <Separator orientation="vertical" />
              <Additional
                category={selectedNode.category}
                parentList={currentFlowNodesWithContents.filter((n) => {
                  switch (selectedNode.category) {
                    case "ground":
                      return n.category === "relief";
                    case "element":
                      return selectedNode.party === "plaintiff"
                        ? n.category === "ground" ||
                            (n.party === "plaintiff" &&
                              n.category === "defense")
                        : n.category === "defense";
                    case "defense":
                      return selectedNode.party === "plaintiff"
                        ? n.category === "ground"
                        : false;
                    default:
                      return false;
                  }
                })}
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
              />
            </>
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

const Additional = ({
  category,
  parentList,
  selectedNode,
  setSelectedNode,
}: {
  category: "ground" | "element" | "defense";
  parentList: FlowNodeWithContent[];
  selectedNode: FlowNode;
  setSelectedNode: React.Dispatch<React.SetStateAction<FlowNode>>;
}) => {
  console.log("parentList: ", parentList);
  return (
    <FieldSet>
      <FieldLegend>
        소속 {category === "ground" ? "청구취지" : "청구원인"}
      </FieldLegend>
      <Separator />
      <RadioGroup
        value={selectedNode.parentId}
        onValueChange={(value) => {
          console.log("value: ", value);
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
  );
};
