import { Ref } from "solid-js";
import { MarkdownEditor } from "../Editor/MarkdownEditor";
import { PageEditorPreview } from "./PageEditorPreview";
import { SplitView } from "../../ui/SplitView/SplitView";

interface DiagramEditorProps {
  previewMode: string;
  content: string;
  diagramType: string;
  onValueChange: (value: string) => void;
  onSaveShortcut: () => void;
  disabled?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function PageEditor(props: DiagramEditorProps) {
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
        mode={mode()}
        left={
          <div
            class="bg-[#181818] h-full px-0 overflow-auto"
            id={"page-editor-panel-editor"}
          >
            <MarkdownEditor
              type={props.diagramType}
              value={props.content}
              onValueChange={props.onValueChange}
              onSave={props.onSaveShortcut}
              disabled={props.disabled}
            />
          </div>
        }
        right={
          <div
            class="bg-[#181818] h-full p-8 px-6 overflow-auto relative"
            id={"page-editor-panel-preview"}
          >
            <PageEditorPreview content={props.content} />
          </div>
        }
      />
    </div>
  );
}
