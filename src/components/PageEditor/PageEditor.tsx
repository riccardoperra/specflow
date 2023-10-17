import { Ref, Show } from "solid-js";
import { MarkdownEditor } from "../Editor/MarkdownEditor";
import { PageEditorPreview } from "./PageEditorPreview";
import { previewMode } from "../Projects/ProjectEditor/ProjectEditorToolbar/ProjectEditorToolbar";

interface DiagramEditorProps {
  content: string;
  diagramType: string;
  onValueChange: (value: string) => void;
  onSaveShortcut: () => void;
  ref?: Ref<HTMLDivElement>;
}

export function PageEditor(props: DiagramEditorProps) {
  return (
    <div class={"h-full w-full"}>
      <div
        class="grid overflow-hidden h-full"
        classList={{
          "grid-cols-1": previewMode() === "editor",
          "grid-cols-2": previewMode() === "editor-with-preview",
        }}
      >
        <div class="bg-[#181818] flex-1 h-full px-0 overflow-auto">
          <MarkdownEditor
            type={props.diagramType}
            value={props.content}
            onValueChange={props.onValueChange}
            onSave={props.onSaveShortcut}
          />
        </div>

        <Show when={previewMode() === "editor-with-preview"}>
          <div
            class={
              "h-full w-[1px] bg-neutral-700 absolute left-[50%] -translate-x-[50%]"
            }
          />

          <div class="flex-1 bg-[#181818] w-full h-full p-8 px-6 overflow-auto">
            <PageEditorPreview content={props.content} />
          </div>
        </Show>
      </div>
    </div>
  );
}
