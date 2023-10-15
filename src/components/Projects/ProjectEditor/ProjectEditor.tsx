import { useParams } from "@solidjs/router";
import { createResource, Show, Signal, Suspense } from "solid-js";
import { getProject, ProjectView } from "../../../core/services/projects";
import { ProjectEditorHeader } from "./ProjectEditorHeader";
import { ProjectEditorSidebar } from "./ProjectEditorSidebar/ProjectEditorSidebar";
import { provideState } from "statebuilder";
import { EditorState } from "./editorState";
import { ProjectEditorContent } from "./ProjectEditorContent/ProjectEditorContent";

export function ProjectEditor() {
  const params = useParams<{ id: string }>();
  const editorState = provideState(EditorState);

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
                <ProjectEditorContent />
              </div>
            </div>
          </div>
        )}
      </Show>
    </Suspense>
  );
}
