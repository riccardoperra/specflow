import { Button } from "@codeui/kit";
import { provideState } from "statebuilder";
import { EditorState } from "../editorState";
import { PreviewState } from "../previewState";

export function DiagramActionToolbar() {
  const editorState = provideState(EditorState);
  const previewState = provideState(PreviewState);
  return (
    <div class={"flex gap-2"}>
      <Button
        style={{ height: "100%" }}
        onClick={() => editorState.actions.triggerSave(true)}
        size={"xs"}
        class={"h-full"}
        theme={"secondary"}
      >
        Save
      </Button>

      <Button
        style={{ height: "100%" }}
        onClick={() => previewState.openToExternalWindow()}
        loading={previewState.openToExternalWindow.loading}
        size={"xs"}
        class={"h-full"}
        theme={"tertiary"}
      >
        Open
      </Button>
    </div>
  );
}
