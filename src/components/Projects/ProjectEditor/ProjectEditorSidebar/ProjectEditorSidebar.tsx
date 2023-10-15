import * as styles from "./ProjectEditorSidebar.css";
import { For, Show } from "solid-js";
import { ProjectView } from "../../../../core/services/projects";
import { provideState } from "statebuilder";
import { EditorState } from "../editorState";
import { PresentationChart } from "../../../../icons/PresentationChart";

interface ProjectEditorSidebarProps {
  project: ProjectView;
}

export function ProjectEditorSidebar(props: ProjectEditorSidebarProps) {
  const editorState = provideState(EditorState);

  return (
    <div class={styles.sidebar}>
      <div class={"flex flex-col gap-2"}>
        <h3 class={"text-sm font-semibold"}>Pages</h3>
        <ul class={"flex flex-col gap-2"}>
          <For each={props.project.project_page}>
            {(page, index) => {
              const isActive = () => editorState.get.activePageId === page.id;
              return (
                <li
                  class={
                    "px-4 py-1.5 hover:bg-neutral-700 rounded-md select-none transition-all ease-in-out"
                  }
                  classList={{
                    "border-blue-600": isActive(),
                    "border-neutral-700": !isActive(),
                  }}
                  onClick={() => editorState.actions.setActivePage(page.id)}
                >
                  <div class={"flex justify-between flex-start gap-2"}>
                    <div class={"flex-1"}>
                      <div class={"flex items-center gap-3"}>
                        <Show when={page.type === "diagram"}>
                          <PresentationChart class={"w-4 h-4"} />
                        </Show>

                        <h1 class={"text-md whitespace-nowrap"}>{page.name}</h1>
                      </div>
                    </div>
                  </div>
                </li>
              );
            }}
          </For>
        </ul>
      </div>
    </div>
  );
}
