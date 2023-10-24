import { useNavigate, useParams } from "@solidjs/router";
import { createResource, Show, Signal, Suspense } from "solid-js";
import { getProject, ProjectView } from "../../../core/services/projects";
import { ProjectEditorHeader } from "./ProjectEditorHeader";
import { ProjectEditorSidebar } from "./ProjectEditorSidebar/ProjectEditorSidebar";
import { provideState } from "statebuilder";
import { EditorState } from "./editorState";
import { ProjectEditorContent } from "./ProjectEditorContent/ProjectEditorContent";
import { ProjectEditorToolbar } from "./ProjectEditorToolbar/ProjectEditorToolbar";
import * as styles from "./ProjectEditor.css";
import { LoadingCircleWithBackdrop } from "../../../icons/LoadingCircle";
import { ProjectEditorNoPagesContent } from "./ProjectEditorNoPagesContent/ProjectEditorNoPagesContent";

export function ProjectEditor() {
  const params = useParams<{ id: string }>();
  const editorState = provideState(EditorState);
  const navigate = useNavigate();

  const [projectView] = createResource(
    () => Number(params.id),
    async (id) => {
      const project = await getProject(id);
      if (!project) {
        navigate("/not-found");
      }
      return project;
    },
    {
      storage: (value) =>
        [
          () => editorState.get.projectView,
          (v: () => ProjectView | null) => {
            editorState.actions.setProjectView(v());
            return editorState.get.projectView;
          },
        ] as Signal<ProjectView | null | undefined>,
      initialValue: null,
    },
  );

  return (
    <Suspense fallback={<LoadingCircleWithBackdrop width={32} height={32} />}>
      <Show when={projectView()} keyed={true}>
        {(projectView) => (
          <div class={"w-full flex flex-col"}>
            <ProjectEditorHeader project={projectView} />
            <div class={"flex h-full min-h-0 relative"}>
              <ProjectEditorSidebar project={projectView} />
              <div class={styles.content}>
                <div class={styles.innerContent}>
                  <Show
                    fallback={
                      <ProjectEditorNoPagesContent projectView={projectView} />
                    }
                    when={editorState.selectedPage()}
                  >
                    <ProjectEditorToolbar />
                    <ProjectEditorContent />
                  </Show>
                </div>
              </div>
            </div>
          </div>
        )}
      </Show>
    </Suspense>
  );
}
