import { Button } from "@codeui/kit";
import { provideState } from "statebuilder";
import { EditorState } from "../editorState";
import { PreviewState } from "../previewState";
import { createControlledDialog } from "../../../../core/utils/controlledDialog";
import { ProjectEditorExportDiagramDialog } from "../ProjectEditorExportDialog/ProjectEditorExportDiagramDialog";

export function DiagramActionToolbar() {
  const editorState = provideState(EditorState);
  const previewState = provideState(PreviewState);

  const controlledDialog = createControlledDialog();

  return (
    <div class={"flex gap-2"}>
      <Button
        style={{ height: "100%" }}
        onClick={() => previewState.openToExternalWindow()}
        loading={previewState.openToExternalWindow.loading}
        size={"sm"}
        class={"h-full"}
        theme={"tertiary"}
      >
        Open
      </Button>
      <Button
        style={{ height: "100%" }}
        onClick={() =>
          controlledDialog(ProjectEditorExportDiagramDialog, {
            projectPage: editorState.selectedPage()!,
          })
        }
        size={"sm"}
        class={"h-full"}
        theme={"primary"}
      >
        Save
      </Button>
    </div>
  );
}
