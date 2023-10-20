import { getOwner } from "solid-js";
import { createControlledDialog } from "../../../../core/utils/controlledDialog";
import { provideState } from "statebuilder";
import { EditorState } from "../editorState";
import { Button } from "@codeui/kit";
import { DocumentTextIcon } from "../../../../icons/DocumentTextIcon";
import { PresentationChart } from "../../../../icons/PresentationChart";
import { ProjectEditorNewDiagramDialog } from "../ProjectEditorNewPageDialog/ProjectEditorNewDiagramDialog";
import { ProjectView } from "../../../../core/services/projects";

interface ProjectEditorNoPagesContentProps {
  projectView: ProjectView;
}

export function ProjectEditorNoPagesContent(
  props: ProjectEditorNoPagesContentProps,
) {
  const owner = getOwner();
  const controlledDialog = createControlledDialog();
  const editorState = provideState(EditorState);

  return (
    <div class={"flex items-center justify-center h-full flex-col gap-12"}>
      <h1 class={"text-4xl"}>No pages found in this project.</h1>
      <div class={"flex gap-3"}>
        <Button
          size={"lg"}
          theme={"primary"}
          leftIcon={<DocumentTextIcon />}
          onClick={() => {
            editorState.openNewPageDialog(owner!, props.projectView.id);
          }}
        >
          New page
        </Button>
        <Button
          size={"lg"}
          theme={"primary"}
          leftIcon={<PresentationChart />}
          onClick={() =>
            controlledDialog(ProjectEditorNewDiagramDialog, {
              onSave: (result) => editorState.actions.addNewPage(result),
              projectId: props.projectView.id,
            })
          }
        >
          <span>New diagram</span>
        </Button>
      </div>
    </div>
  );
}
