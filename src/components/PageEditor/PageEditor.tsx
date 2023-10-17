import { createEffect, Ref, Show } from "solid-js";
import { MarkdownEditor } from "../Editor/MarkdownEditor";
import { PageEditorPreview } from "./PageEditorPreview";
import { previewMode } from "../Projects/ProjectEditor/ProjectEditorToolbar/ProjectEditorToolbar";
import Split, { SplitInstance } from "split-grid";

interface DiagramEditorProps {
  content: string;
  diagramType: string;
  onValueChange: (value: string) => void;
  onSaveShortcut: () => void;
  ref?: Ref<HTMLDivElement>;
}

export function PageEditor(props: DiagramEditorProps) {
  let split: SplitInstance;
  createEffect(() => {
    const mode = previewMode();
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
          "w-full": previewMode() === "editor",
          "grid grid-cols-[1fr_5px_1fr]":
            previewMode() === "editor-with-preview",
        }}
      >
        <div
          class="bg-[#181818] h-full px-0 overflow-auto"
          id={"page-editor-panel-editor"}
        >
          <MarkdownEditor
            type={props.diagramType}
            value={props.content}
            onValueChange={props.onValueChange}
            onSave={props.onSaveShortcut}
          />
        </div>

        <Show when={previewMode() === "editor-with-preview"}>
          <div class="gutter-col gutter-col-1"></div>
          <div
            class="bg-[#181818] h-full p-8 px-6 overflow-auto relative"
            id={"page-editor-panel-preview"}
          >
            <PageEditorPreview content={props.content} />
          </div>
        </Show>
      </div>
    </div>
  );
}
