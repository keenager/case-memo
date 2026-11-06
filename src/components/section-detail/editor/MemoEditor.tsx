import "@/components/section-detail/editor/styles.css";
import UniqueID from "@tiptap/extension-unique-id";
import { EditorContent, useEditor } from "@tiptap/react";
import { FloatingMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { debounce } from "@/lib/memo/debounce";
import type { ArgsForEditor } from "@/lib/memo/types";
import { useFlow } from "@/store/diagram";
import { isEmpty, saveMemo } from "../../../lib/memo/save";
import BubbleMenuBar from "./BubbleMenuBar";
import { MenuBar } from "./MenuBar";
import "./editor.css"
import Highlight from "@tiptap/extension-highlight"

export default function MemoEditor(props: ArgsForEditor) {
  const { caseId, sectionCategory, contents } = props;
  const flowNodes = useFlow(state => state.currentFlowNodes);

  const [showNoti, setShowNoti] = useState(false);
  const toggleNoti = () => {
    setShowNoti(true);
    setTimeout(() => {
      setShowNoti(false);
    }, 2000);
  };

  const debouncedSave = useRef(
    debounce(async () => {
      await saveHandler();
      console.log("업데이트!!!");
    }, 1500),
  ).current;
  // console.log("MemoEditor contents:", contents);


  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({multicolor: true}),
      UniqueID.configure({ types: ["heading", "paragraph"] }),
    ],
    content: contents ? JSON.parse(contents) : "",
    editorProps: {
      attributes: { class: "prose prose-sm max-w-none focus:outline-none" },
    },
    onUpdate: ({ editor }) => {
      const currentContents = editor.getJSON();
      if (isEmpty(currentContents)) return;
      debouncedSave();
    },
  });
  
  useEffect(() => {
    if(!editor) return;

    flowNodes.forEach((fn)=>{
      let startPos = 0,endPos = 0;

      editor.state.doc.descendants((node, pos) => {
        if(node.attrs.id === fn.paraId){
            startPos = pos + 1;
            endPos = pos + node.nodeSize -1;
            editor.chain().setTextSelection({from: startPos, to: endPos}).setHighlight({ color: '#fff3bf' }).blur().run();
            return false;
        }
        return true;
      })
    })
    // editor.commands.focus("start");

    // console.log("MemoEditor contents changed:", contents);
  }, [editor, flowNodes]);

  const saveHandler = async () => {
    try {
      if (sectionCategory === "hearings") {
        if (!props.hearingId) {
          console.error("Hearing ID is required for hearings section");
          return;
        }
        await saveMemo({
          caseId,
          sectionCategory,
          hearingId: props.hearingId,
          contents: editor.getJSON(),
        });
        toggleNoti();
      } else {
        await saveMemo({
          caseId,
          sectionCategory,
          contents: editor.getJSON(),
        });
        toggleNoti();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <MenuBar editor={editor} />
      <div className="flex gap-3">
        {showNoti && (
          <div className="flex items-center gap-2">
            <Check color="green" size={15} />
            <span className="text-sm">저장 완료</span>
          </div>
        )}
        {/* <Button onClick={saveHandler}>저장</Button> */}
      </div>
      <EditorContent editor={editor} className="flex-1 border rounded-md p-1" />
      <FloatingMenu editor={editor} className="border">
        This is the floating menu
      </FloatingMenu>
      {sectionCategory === "arguments-summary" && (
        <BubbleMenuBar editor={editor} />
      )}
    </>
  );
}
