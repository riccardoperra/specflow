import { useParams } from "@solidjs/router";
import { createResource, createSignal, Show, Signal, Suspense } from "solid-js";
import { getProject, ProjectView } from "../../../core/services/projects";
import { ProjectEditorHeader } from "./ProjectEditorHeader";
import { ProjectEditorSidebar } from "./ProjectEditorSidebar/ProjectEditorSidebar";
import { provideState } from "statebuilder";
import { EditorState } from "./editorState";
import { ProjectEditorContent } from "./ProjectEditorContent/ProjectEditorContent";
import { Button, Dialog, DialogPanelContent, TextField } from "@codeui/kit";
import { ProjectEditorPageSettingsDialog } from "./ProjectEditorPageSettings/ProjectEditorPageSettingsDialog";

export function ProjectEditor() {
  const params = useParams<{ id: string }>();
  const editorState = provideState(EditorState);

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
      <Show when={projectView()}>
        {(projectView) => (
          <div class={"w-full flex flex-col"}>
            <ProjectEditorHeader project={projectView()} />
            <div class={"flex h-full"}>
              <ProjectEditorSidebar project={projectView()} />
              <div class={"flex-1 relative"}>
                <div class={"flex pr-6 pl-3 py-2 gap-2"}>
                  <div>
                    <Button
                      size={"xs"}
                      theme={"secondary"}
                      leftIcon={
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-5 h-5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                          />
                        </svg>
                      }
                      onClick={() => setShowDetailsPage(!showDetailsPage())}
                    >
                      Edit details
                    </Button>
                  </div>
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
