import { useParams } from "@solidjs/router";
import { createResource, createSignal, Show, Signal, Suspense } from "solid-js";
import { getProject, ProjectView } from "../../../core/services/projects";
import { ProjectEditorHeader } from "./ProjectEditorHeader";
import { ProjectEditorSidebar } from "./ProjectEditorSidebar/ProjectEditorSidebar";
import { provideState } from "statebuilder";
import { EditorState } from "./editorState";
import { ProjectEditorContent } from "./ProjectEditorContent/ProjectEditorContent";
import { Button, Dialog, DialogPanelContent, TextField } from "@codeui/kit";

export function ProjectEditor() {
  const params = useParams<{ id: string }>();
  const editorState = provideState(EditorState);

  const [openGenerateDialog, setOpenGenerateDialog] = createSignal(false);

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
      <Show when={projectView()}>
        {(projectView) => (
          <div class={"w-full flex flex-col"}>
            <ProjectEditorHeader project={projectView()} />
            <div class={"flex h-full"}>
              <ProjectEditorSidebar project={projectView()} />
              <div class={"flex-1"}>
                <div class={"flex px-6 py-2"}>
                  <div class={"ml-auto flex gap-2"}>
                    <Button
                      size={"xs"}
                      theme={"secondary"}
                      onClick={() => setOpenGenerateDialog(true)}
                    >
                      Generate
                    </Button>
                    <Button
                      onClick={() => editorState.actions.triggerSave(true)}
                      size={"xs"}
                      theme={"secondary"}
                    >
                      Save
                    </Button>
                  </div>
                </div>

                <ProjectEditorContent />
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
