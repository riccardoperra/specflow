import * as styles from "./ProjectEditorSidebar.css";
import { For, getOwner, Match, Switch } from "solid-js";
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
  Tooltip,
} from "@codeui/kit";
import { bgBrand } from "../../../../global.css";
import { PlusIcon } from "../../../../icons/PlusIcon";
import { As } from "@kobalte/core";
import { DocumentTextIcon } from "../../../../icons/DocumentTextIcon";
import { ProjectEditorShowOnEditable } from "../ProjectEditorShowOnEditable/ProjectEditorShowOnEditable";

interface ProjectEditorSidebarProps {
  project: ProjectView;
}

export function ProjectEditorSidebar(props: ProjectEditorSidebarProps) {
  const editorState = provideState(EditorState);
  const owner = getOwner();
  return (
    <div
      class={styles.sidebar}
      data-visible={editorState.get.showSidebar ? "" : undefined}
    >
      <div class={"flex flex-col gap-2"}>
        <div class={"flex justify-between items-center"}>
          <h3 class={"text-sm font-semibold"}>Pages</h3>

          <ProjectEditorShowOnEditable>
            <Tooltip
              disabled={editorState.canCreateNewProjectPage()}
              content={`You reached the max limit of pages: ${editorState.maxPageLimit()}`}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <As
                    aria-label={"Open dropdown"}
                    size={"xs"}
                    theme={"secondary"}
                    disabled={!editorState.canCreateNewProjectPage()}
                    component={IconButton}
                  >
                    <PlusIcon class={"w-4 h-4"} />
                  </As>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      rightSlot={<DocumentTextIcon />}
                      onClick={() =>
                        editorState.openNewPageDialog(owner!, props.project.id)
                      }
                    >
                      New page
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      rightSlot={<PresentationChart />}
                      onClick={() =>
                        editorState.openNewDiagramDialog(
                          owner!,
                          props.project.id,
                        )
                      }
                    >
                      <span>New diagram</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            </Tooltip>
          </ProjectEditorShowOnEditable>
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
                            <PresentationChart class={"w-5 h-5"} />
                          </Match>
                          <Match when={page.type === "page"}>
                            <DocumentTextIcon class={"w-5 h-5"} />
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
