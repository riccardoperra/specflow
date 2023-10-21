import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  IconButton,
} from "@codeui/kit";
import { CogIcon } from "../../../../icons/CogIcon";
import { TrashIcon } from "../../../../icons/TrashIcon";
import { ProjectEditorPageSettingsDialog } from "../ProjectEditorPageSettingsDialog/ProjectEditorPageSettingsDialog";
import { ConfirmDialog } from "../../../ConfirmDialog/ConfirmDialog";
import { createSignal, Match, Show, Switch } from "solid-js";
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
import { DiagramActionToolbar } from "./DiagramActionToolbar";
import { PageActionToolbar } from "./PageActionToolbar";
import { createBreakpoints } from "../../../../core/utils/breakpoint";
import { As } from "@kobalte/core";
import { EllipsisIcon } from "../../../../icons/EllipsisIcon";

export function ProjectEditorToolbar() {
  const breakpoints = createBreakpoints();
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
      <Show when={!breakpoints.sm}>
        <div class={"flex gap-2 h-[32px] ml-auto"}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <As
                style={{ height: "100%" }}
                component={IconButton}
                aria-label={"Action menu"}
                theme={"secondary"}
                size={"xs"}
              >
                <EllipsisIcon />
              </As>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent>
                <DropdownMenuItem
                  rightSlot={<CogIcon />}
                  onClick={onEditDetails}
                >
                  Edit details
                </DropdownMenuItem>
                <DropdownMenuItem rightSlot={<TrashIcon />} onClick={onDelete}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </div>
      </Show>

      <Show when={breakpoints.sm}>
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
        <div class={"ml-auto flex"}>
          <Switch>
            <Match when={editorState.selectedPage()?.type === "diagram"}>
              <DiagramActionToolbar />
            </Match>
            <Match when={editorState.selectedPage()?.type === "page"}>
              <PageActionToolbar />
            </Match>
          </Switch>
        </div>
      </Show>

      <div class={"absolute mx-auto h-[32px] left-[50%] -translate-x-[50%]"}>
        <SegmentedControl
          onChange={(value) => editorState.actions.setPreviewMode(value)}
          value={editorState.get.previewMode}
        >
          <SegmentedControlItem value={"editor"}>
            <CodeIcon class={"w-4 h-4"} />
          </SegmentedControlItem>
          <Show when={breakpoints.sm}>
            <SegmentedControlItem value={"editor-with-preview"}>
              <div class={"flex gap-2"}>
                <CodeIcon class={"w-4 h-4"} />
                <PresentationChart class={"w-4 h-4"} />
              </div>
            </SegmentedControlItem>
          </Show>

          <SegmentedControlItem value={"preview"}>
            <PresentationChart class={"w-4 h-4"} />
          </SegmentedControlItem>
        </SegmentedControl>
      </div>
    </div>
  );
}
