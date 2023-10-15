import { useParams } from "@solidjs/router";
import { createResource, createSignal, Show, Signal, Suspense } from "solid-js";
import { getProject, ProjectView } from "../../../core/services/projects";
import { ProjectEditorHeader } from "./ProjectEditorHeader";
import { ProjectEditorSidebar } from "./ProjectEditorSidebar/ProjectEditorSidebar";
import { provideState } from "statebuilder";
import { EditorState } from "./editorState";
import { ProjectEditorContent } from "./ProjectEditorContent/ProjectEditorContent";
import { Button, Dialog, DialogPanelContent, TextField } from "@codeui/kit";
import { ProjectEditorPageSettingsDialog } from "./ProjectEditorPageSettingsDialog/ProjectEditorPageSettingsDialog";
import { PreviewState } from "./previewState";
import { SparklesIcon } from "../../../icons/SparklesIcon";
import { CogIcon } from "../../../icons/CogIcon";

export function ProjectEditor() {
  const params = useParams<{ id: string }>();
  const editorState = provideState(EditorState);
  const previewState = provideState(PreviewState);

  const [openGenerateDialog, setOpenGenerateDialog] = createSignal(false);
  const [showDetailsPage, setShowDetailsPage] = createSignal(false);

  const [projectView] = createResource(() => Number(params.id), getProject, {
    storage: (value) =>
      [
        () => editorState.get.projectView,
        (v: () => ProjectView | null) => {
          editorState.actions.setProjectView(v());
          return editorState.get.projectView;
        },
      ] as Signal<ProjectView | null | undefined>,
    initialValue: null,
  });

  return (
    <Suspense>
      <Show when={projectView()} keyed={true}>
        {(projectView) => (
          <div class={"w-full flex flex-col"}>
            <ProjectEditorHeader project={projectView} />
            <div class={"flex h-full"}>
              <ProjectEditorSidebar project={projectView} />
              <div class={"flex-1 relative"}>
                <div class={"flex pr-6 pl-3 py-2 gap-2"}>
                  <div class={"flex gap-2"}>
                    <Button
                      size={"xs"}
                      theme={"secondary"}
                      leftIcon={<CogIcon />}
                      onClick={() => setShowDetailsPage(!showDetailsPage())}
                    >
                      Edit details
                    </Button>
                    <Button
                      size={"xs"}
                      theme={"secondary"}
                      leftIcon={<SparklesIcon class={"h-3 w-3"} />}
                      onClick={() => setOpenGenerateDialog(true)}
                    >
                      Generate with AI
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

                <ProjectEditorContent />

                <Show when={editorState.selectedPage()}>
                  <ProjectEditorPageSettingsDialog
                    open={showDetailsPage()}
                    onOpenChange={setShowDetailsPage}
                    projectPage={editorState.selectedPage()!}
                    onSave={(data) =>
                      editorState.actions.updateProjectSettings(data)
                    }
                  />
                </Show>
              </div>
            </div>
          </div>
        )}
      </Show>

      <Dialog
        open={openGenerateDialog()}
        title={`Generate diagram`}
        size={"lg"}
        onOpenChange={(value) => setOpenGenerateDialog(value)}
      >
        <DialogPanelContent>
          <TextField label={"Description"} />
        </DialogPanelContent>
      </Dialog>
    </Suspense>
  );
}
