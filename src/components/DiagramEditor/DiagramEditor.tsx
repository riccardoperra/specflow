import { MermaidPreview } from "./MermaidPreview";
import { MermaidEditor } from "../Editor/MermaidEditor";
import { Ref, Show } from "solid-js";
import { SplitView } from "../SplitView/SplitView";

interface DiagramEditorProps {
  previewMode: string;
  pageId: string;
  content: string;
  diagramType: string;
  onValueChange: (value: string) => void;
  onSaveShortcut: () => void;
  ref?: Ref<HTMLDivElement>;
}

export function DiagramEditor(props: DiagramEditorProps) {
  const mode = () => {
    switch (props.previewMode) {
      case "editor":
        return "left";
      case "preview":
        return "right";
      case "editor-with-preview":
        return "both";
      default:
        return "left";
    }
  };
  return (
    <div class={"h-full w-full"}>
      <SplitView
        left={
          <div class="bg-[#181818] h-full px-2 p-4">
            <MermaidEditor
              type={props.diagramType}
              value={props.content}
              onValueChange={props.onValueChange}
              onSave={props.onSaveShortcut}
            />
          </div>
        }
        right={
          <div class="flex items-center justify-center bg-neutral-800 h-full">
            <MermaidPreview
              id={props.pageId}
              ref={props.ref!}
              content={props.content}
            />
          </div>
        }
        mode={mode()}
      />
    </div>
  );
}
