import { Link } from "@solidjs/router";
import { createResource, For, Show, Suspense } from "solid-js";
import { getProjects } from "../../core/services/projects";
import { Button, IconButton, Tooltip } from "@codeui/kit";
import { CurrentUserBadge } from "../../ui/UserBadge/CurrentUserBadge";
import { createControlledDialog } from "../../core/utils/controlledDialog";
import { NewProjectDialog } from "./NewProjectDialog/NewProjectDialog";
import { LoadingCircleWithBackdrop } from "../../icons/LoadingCircle";
import { ReloadIcon } from "../../icons/ReloadIcon";
import { ProjectCard } from "./ProjectCard/ProjectCard";
import { PlatformState } from "../../core/state/platform";
import { provideState } from "statebuilder";

export function Projects() {
  const links = [{ path: "/projects", label: "Dashboard" }];

  const [projects, { refetch }] = createResource(getProjects);
  const platformState = provideState(PlatformState);

  const controlledDialog = createControlledDialog();

  const canCreateNewProject = () => {
    if (projects.state !== "ready") {
      return false;
    }
    return (projects()?.length ?? 0) < platformState().max_project_row_per_user;
  };

  const onCreateProject = () => {
    controlledDialog(NewProjectDialog, { onSave: refetch });
  };

  return (
    <div class={"flex flex-col w-full"}>
      <nav
        class={
          "h-[56px] bg-[#151516] px-6 flex items-center gap-2 border-b border-b-neutral-700 flex-shrink-0"
        }
      >
        <div class={"container mx-auto"}>
          <div class={"flex gap-4 text-lg items-center"}>
            <For each={links}>
              {(link, index) => (
                <>
                  <Link href={link.path} class={"font-semibold"}>
                    {link.label}
                  </Link>
                  <Show when={index() + 1 < links.length}>/</Show>
                </>
              )}
            </For>
            <div class={"ml-auto"}>
              <CurrentUserBadge />
            </div>
          </div>
        </div>
      </nav>

      <div
        class={
          "container mx-auto py-4 px-4 pr-2 md:px-0 md:mt-12 flex flex-col h-full overflow-auto"
        }
      >
        <div class={"flex justify-between items-center flex-shrink-0"}>
          <h1 class={"text-2xl font-bold"}>My projects</h1>
          <div class={"flex gap-2"}>
            <IconButton
              aria-label={"Reload"}
              theme={"tertiary"}
              onClick={refetch}
            >
              <ReloadIcon class={"h-5 w-5"} />
            </IconButton>
            <Tooltip
              disabled={canCreateNewProject()}
              content={`You reached the max limit of projects: ${platformState()
                ?.max_project_row_per_user}`}
            >
              <Button
                disabled={!canCreateNewProject()}
                theme={"primary"}
                onClick={onCreateProject}
              >
                Create project
              </Button>
            </Tooltip>
          </div>
        </div>

        <div class={"mt-4"}>
          <div class={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
            <Suspense
              fallback={<LoadingCircleWithBackdrop width={32} height={32} />}
            >
              <For each={projects()}>
                {(project) => <ProjectCard project={project} />}
              </For>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
