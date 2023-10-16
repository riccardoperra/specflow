import { Button, Dialog, DialogPanelContent, TextField } from "@codeui/kit";
import { CogIcon } from "../../../../icons/CogIcon";
import { SparklesIcon } from "../../../../icons/SparklesIcon";
import { TrashIcon } from "../../../../icons/TrashIcon";
import { ProjectEditorPageSettingsDialog } from "../ProjectEditorPageSettingsDialog/ProjectEditorPageSettingsDialog";
import { ConfirmDialog } from "../../../ConfirmDialog/ConfirmDialog";
import { createSignal } from "solid-js";
import { deleteProjectPage } from "../../../../core/services/projects";
import { createControlledDialog } from "../../../../core/utils/controlledDialog";
import { provideState } from "statebuilder";
import { EditorState } from "../editorState";
import { PreviewState } from "../previewState";
import { generateMermaidDiagramCode } from "../../../../core/services/gpt";

export function ProjectEditorToolbar() {
  const editorState = provideState(EditorState);
  const previewState = provideState(PreviewState);

  const controlledDialog = createControlledDialog();

  const onEditDetails = () => {
    controlledDialog(ProjectEditorPageSettingsDialog, {
      projectPage: editorState.selectedPage()!,
      onSave: (data) => editorState.actions.updateProjectSettings(data),
    });
  };

  const onDelete = () => {
    controlledDialog(ConfirmDialog, (openChange) => {
      const [loading, setLoading] = createSignal(false);
      return {
        title: "Delete page",
        message: "The action is not reversible.",
        onConfirm: () => {
          setLoading(true);
          const id = editorState.selectedPage()!.id;
          deleteProjectPage(editorState.selectedPage()!.id)
            .then(() => setLoading(false))
            .then(() => editorState.actions.removePage(id))
            .finally(() => openChange(false));
        },
        closeOnConfirm: false,
        loading: loading,
        actionType: "danger" as const,
      };
    });
  };

  return (
    <div class={"flex pr-6 pl-3 py-2 gap-2"}>
      <div class={"flex gap-2"}>
        <Button
          size={"xs"}
          theme={"secondary"}
          leftIcon={<CogIcon />}
          onClick={onEditDetails}
        >
          Edit details
        </Button>
        <Button
          size={"xs"}
          theme={"negative"}
          leftIcon={<TrashIcon class={"h-4 w-4"} />}
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
      <div class={"ml-auto flex gap-2"}>
        <Button
          onClick={() => editorState.actions.triggerSave(true)}
          size={"xs"}
          theme={"secondary"}
        >
          Save
        </Button>

        <Button
          onClick={() => previewState.openToExternalWindow()}
          loading={previewState.openToExternalWindow.loading}
          size={"xs"}
          theme={"tertiary"}
        >
          Open
        </Button>
      </div>
    </div>
  );
}
