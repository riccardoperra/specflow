import { useNavigate, useParams } from "@solidjs/router";
import { createResource, Show, Suspense } from "solid-js";
import { getProject, ProjectView } from "../../../core/services/projects";
import { ProjectEditorHeader } from "./ProjectEditorHeader";
import { ProjectEditorSidebar } from "./ProjectEditorSidebar/ProjectEditorSidebar";
import {
  provideState,
  StateProvider,
  ɵWithResourceStorage,
} from "statebuilder";
import { EditorState } from "./editorState";
import { ProjectEditorContent } from "./ProjectEditorContent/ProjectEditorContent";
import { ProjectEditorToolbar } from "./ProjectEditorToolbar/ProjectEditorToolbar";
import * as styles from "./ProjectEditor.css";
import { LoadingCircleWithBackdrop } from "../../../icons/LoadingCircle";
import { ProjectEditorNoPagesContent } from "./ProjectEditorNoPagesContent/ProjectEditorNoPagesContent";

export function ProjectEditorRoot() {
  return (
    <StateProvider>
      <ProjectEditor />
    </StateProvider>
  );
}

function ProjectEditor() {
  const params = useParams<{ id: string }>();
  const editorState = provideState(EditorState);
  const navigate = useNavigate();

  const [projectView] = createResource(
    () => params.id,
    async (id) => {
      const project = await getProject(id);
      if (!project) {
        navigate("/not-found");
      }
      return project;
    },
    {
      storage: ɵWithResourceStorage(
        Object.assign(() => editorState.get.projectView, {
          set: (v: ProjectView | null) => editorState.actions.setProjectView(v),
        }),
      ),
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
