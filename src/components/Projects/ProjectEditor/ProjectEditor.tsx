import { useParams } from "@solidjs/router";
import { createResource, Show, Signal, Suspense } from "solid-js";
import { getProject, ProjectView } from "../../../core/services/projects";
import { ProjectEditorHeader } from "./ProjectEditorHeader";
import { ProjectEditorSidebar } from "./ProjectEditorSidebar/ProjectEditorSidebar";
import { provideState } from "statebuilder";
import { EditorState } from "./editorState";
import { ProjectEditorContent } from "./ProjectEditorContent/ProjectEditorContent";
import { ProjectEditorToolbar } from "./ProjectEditorToolbar/ProjectEditorToolbar";
import * as styles from "./ProjectEditor.css";

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
      <Show when={projectView()} keyed={true}>
        {(projectView) => (
          <div class={"w-full flex flex-col"}>
            <ProjectEditorHeader project={projectView} />
            <div class={"flex h-full min-h-0"}>
              <ProjectEditorSidebar project={projectView} />
              <div class={styles.content}>
                <div class={styles.innerContent}>
                  <ProjectEditorToolbar />
                  <ProjectEditorContent />
                </div>
              </div>
            </div>
          </div>
        )}
      </Show>
    </Suspense>
  );
}
