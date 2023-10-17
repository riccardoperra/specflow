import { Button } from "@codeui/kit";
import { CogIcon } from "../../../../icons/CogIcon";
import { TrashIcon } from "../../../../icons/TrashIcon";
import { ProjectEditorPageSettingsDialog } from "../ProjectEditorPageSettingsDialog/ProjectEditorPageSettingsDialog";
import { ConfirmDialog } from "../../../ConfirmDialog/ConfirmDialog";
import { createSignal } from "solid-js";
import { deleteProjectPage } from "../../../../core/services/projects";
import { createControlledDialog } from "../../../../core/utils/controlledDialog";
import { provideState } from "statebuilder";
import { EditorState } from "../editorState";
import { PreviewState } from "../previewState";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "../../../SegmentedControl/SegmentedControl";
import { CodeIcon } from "../../../../icons/CodeIcon";
import { PresentationChart } from "../../../../icons/PresentationChart";

export const [previewMode, setPreviewMode] = createSignal<string>(
  "editor-with-preview",
);

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
    <div class={"flex pr-6 pl-3 py-2 gap-2 flex-shrink"}>
      <div class={"flex gap-2 h-[32px]"}>
        <Button
          style={{ height: "100%" }}
          theme={"secondary"}
          size={"xs"}
          leftIcon={<CogIcon />}
          onClick={onEditDetails}
        >
          Edit details
        </Button>
        <Button
          style={{ height: "100%" }}
          size={"xs"}
          class={"h-full"}
          theme={"negative"}
          leftIcon={<TrashIcon class={"h-4 w-4"} />}
          onClick={onDelete}
        >
          Delete
        </Button>
      </div>
      <div class={"absolute mx-auto h-[32px] left-[50%] -translate-x-[50%]"}>
        <SegmentedControl onChange={setPreviewMode}>
          <SegmentedControlItem value={"editor"}>
            <CodeIcon class={"w-4 h-4"} />
          </SegmentedControlItem>
          <SegmentedControlItem value={"editor-with-preview"}>
            <PresentationChart class={"w-4 h-4"} />
          </SegmentedControlItem>
        </SegmentedControl>
      </div>
      <div class={"ml-auto flex gap-2"}>
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
    </div>
  );
}
