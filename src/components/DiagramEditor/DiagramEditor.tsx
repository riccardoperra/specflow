import { MermaidPreview } from "./MermaidPreview";
import { MermaidEditor } from "../Editor/MermaidEditor";
import { Ref } from "solid-js";

interface DiagramEditorProps {
  content: string;
  diagramType: string;
  onValueChange: (value: string) => void;
  onSaveShortcut: () => void;
  ref?: Ref<HTMLDivElement>;
}

export function DiagramEditor(props: DiagramEditorProps) {
  return (
    <div class={"h-full w-full"}>
      <div class="flex w-full h-full rounded-tl-2xl rounded-tr-2xl overflow-hidden shadow-lg">
        <div class="bg-[#181818] w-[35%] h-full px-2 p-4">
          <MermaidEditor
            type={props.diagramType}
            value={props.content}
            onValueChange={props.onValueChange}
            onSave={props.onSaveShortcut}
          />
        </div>

        <div class="flex-1 flex items-center justify-center bg-neutral-800 h-full">
          <MermaidPreview ref={props.ref!} content={props.content} />
        </div>
      </div>
    </div>
  );
}
