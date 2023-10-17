import { MermaidPreview } from "./MermaidPreview";
import { MermaidEditor } from "../Editor/MermaidEditor";
import { createEffect, Ref, Show } from "solid-js";
import Split, { SplitInstance } from "split-grid";

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
  let split: SplitInstance;
  createEffect(() => {
    const mode = props.previewMode;
    if (split) {
      split.destroy(true);
    }
    if (mode === "editor") {
    } else if (mode === "editor-with-preview") {
      split = Split({
        columnGutters: [
          {
            track: 1,
            element: document.querySelector(".gutter-col-1")!,
          },
        ],
      });
    }
  });

  return (
    <div class={"h-full w-full"}>
      <div
        class="overflow-hidden h-full relative"
        classList={{
          "w-full": props.previewMode !== "editor-with-preview",
          "grid grid-cols-[1fr_5px_1fr]":
            props.previewMode === "editor-with-preview",
        }}
      >
        <Show
          when={["editor", "editor-with-preview"].includes(props.previewMode)}
        >
          <div
            class="bg-[#181818] h-full px-2 p-4"
            id={"page-editor-panel-editor"}
          >
            <MermaidEditor
              type={props.diagramType}
              value={props.content}
              onValueChange={props.onValueChange}
              onSave={props.onSaveShortcut}
            />
          </div>
        </Show>

        <Show when={props.previewMode === "editor-with-preview"}>
          <div class="gutter-col gutter-col-1"></div>
        </Show>

        <Show
          when={["editor-with-preview", "preview"].includes(props.previewMode)}
        >
          <div
            class="flex items-center justify-center bg-neutral-800 h-full"
            id={"page-editor-panel-preview"}
          >
            <MermaidPreview
              id={props.pageId}
              ref={props.ref!}
              content={props.content}
            />
          </div>
        </Show>
      </div>
    </div>
  );
}
