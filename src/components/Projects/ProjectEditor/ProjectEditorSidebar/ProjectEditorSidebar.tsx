import * as styles from "./ProjectEditorSidebar.css";
import { For, Show } from "solid-js";
import { ProjectView } from "../../../../core/services/projects";
import { provideState } from "statebuilder";
import { EditorState } from "../editorState";
import { PresentationChart } from "../../../../icons/PresentationChart";
import { IconButton } from "@codeui/kit";
import { bgBrand } from "../../../../global.css";
import { createControlledDialog } from "../../../../core/utils/controlledDialog";
import { ProjectEditorNewPageDialog } from "../ProjectEditorNewPageDialog/ProjectEditorNewPageDialog";
import { PlusIcon } from "../../../../icons/PlusIcon";

interface ProjectEditorSidebarProps {
  project: ProjectView;
}

export function ProjectEditorSidebar(props: ProjectEditorSidebarProps) {
  const editorState = provideState(EditorState);

  const controlledDialog = createControlledDialog();

  return (
    <div class={styles.sidebar}>
      <div class={"flex flex-col gap-2"}>
        <div class={"flex justify-between items-center"}>
          <h3 class={"text-sm font-semibold"}>Pages</h3>
          <IconButton
            aria-label={"Add new page"}
            size={"xs"}
            theme={"secondary"}
            onClick={() =>
              controlledDialog(ProjectEditorNewPageDialog, {
                onSave: (result) => editorState.actions.addNewPage(result),
                projectId: props.project.id,
              })
            }
          >
            <PlusIcon class={"w-4 h-4"} />
          </IconButton>
        </div>
        <ul class={"flex flex-col gap-2"}>
          <For each={props.project.project_page}>
            {(page, index) => {
              const isActive = () => editorState.get.activePageId === page.id;
              // TODO use vanilla extract
              return (
                <li
                  class={
                    "px-4 py-1.5 hover:bg-neutral-700 rounded-md select-none transition-all ease-in-out"
                  }
                  classList={{
                    [bgBrand]: isActive(),
                  }}
                  onClick={() => editorState.actions.setActivePage(page.id)}
                >
                  <div
                    class={
                      "flex justify-between flex-start gap-2 overflow-hidden"
                    }
                  >
                    <div class={"flex-1"}>
                      <div class={"flex items-center gap-3"}>
                        <Show when={page.type === "diagram"}>
                          <PresentationChart class={"w-4 h-4"} />
                        </Show>

                        <h1
                          class={
                            "text-md whitespace-nowrap block text-ellipsis"
                          }
                        >
                          {page.name}
                        </h1>
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
