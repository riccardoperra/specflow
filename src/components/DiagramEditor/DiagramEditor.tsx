import { MermaidPreview } from "./MermaidPreview";
import { MermaidEditor } from "../Editor/MermaidEditor";

interface DiagramEditorProps {
  content: string;
  metadata: {
    diagramType: string;
  };
}

export function DiagramEditor(props: DiagramEditorProps) {
  return (
    <div class={"h-full w-full"}>
      <div class="flex w-full h-full rounded-lg overflow-hidden shadow-lg">
        <div class="bg-[#181818] w-[35%] h-full px-2 p-4">
          <MermaidEditor
            type={props.metadata.diagramType}
            value={props.content}
            onValueChange={() => void 0}
            onSave={() => void 0}
          />
        </div>

        <div class="flex-1 flex items-center justify-center bg-neutral-800 h-full">
          <MermaidPreview content={props.content} />
        </div>
      </div>
    </div>
  );
}
