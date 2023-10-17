import * as styles from "./ProjectEditorSidebar.css";
import { For, Match, Switch } from "solid-js";
import { ProjectView } from "../../../../core/services/projects";
import { provideState } from "statebuilder";
import { EditorState } from "../editorState";
import { PresentationChart } from "../../../../icons/PresentationChart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  IconButton,
} from "@codeui/kit";
import { bgBrand } from "../../../../global.css";
import { createControlledDialog } from "../../../../core/utils/controlledDialog";
import { ProjectEditorNewPageDialog } from "../ProjectEditorNewPageDialog/ProjectEditorNewPageDialog";
import { PlusIcon } from "../../../../icons/PlusIcon";
import { As } from "@kobalte/core";
import { ProjectEditorNewDiagramDialog } from "../ProjectEditorNewPageDialog/ProjectEditorNewDiagramDialog";
import { DocumentTextIcon } from "../../../../icons/DocumentTextIcon";

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <As
                aria-label={"Open dropdown"}
                size={"xs"}
                theme={"secondary"}
                component={IconButton}
              >
                <PlusIcon class={"w-4 h-4"} />
              </As>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent>
                <DropdownMenuItem
                  rightSlot={<DocumentTextIcon />}
                  onClick={() => {
                    controlledDialog(ProjectEditorNewPageDialog, {
                      onSave: (result) =>
                        editorState.actions.addNewPage(result),
                      projectId: props.project.id,
                    });
                  }}
                >
                  New page
                </DropdownMenuItem>
                <DropdownMenuItem
                  rightSlot={<PresentationChart />}
                  onClick={() =>
                    controlledDialog(ProjectEditorNewDiagramDialog, {
                      onSave: (result) =>
                        editorState.actions.addNewPage(result),
                      projectId: props.project.id,
                    })
                  }
                >
                  <span>New diagram</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
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
                        <Switch>
                          <Match when={page.type === "diagram"}>
                            <PresentationChart class={"w-4 h-4"} />
                          </Match>
                          <Match when={page.type === "page"}>
                            <DocumentTextIcon class={"w-4 h-4"} />
                          </Match>
                        </Switch>
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
