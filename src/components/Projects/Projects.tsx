import { Link, useNavigate } from "@solidjs/router";
import { createResource, ErrorBoundary, For, Show, Suspense } from "solid-js";
import { getProjects, Project } from "../../core/services/projects";
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
  const navigate = useNavigate();
  const [projects, { refetch, mutate }] = createResource(getProjects);
  const platformState = provideState(PlatformState);

  const controlledDialog = createControlledDialog();

  const canCreateNewProject = () => {
    if (projects.state !== "ready") {
      return false;
    }
    return (projects()?.length ?? 0) < platformState().max_project_row_per_user;
  };

  const onDeleteProject = ({ id }: Project) => {
    mutate((projects) =>
      (projects ?? []).filter((project) => project.id !== id),
    );
  };

  const onEditProject = ({ id, name, description }: Project) => {
    mutate((projects) =>
      (projects ?? []).map((project) => {
        if (project.id === id) {
          return { ...project, name, description };
        }
        return project;
      }),
    );
  };

  const onCreateProject = () => {
    controlledDialog(NewProjectDialog, {
      onSave: (result) => {
        navigate(`/projects/${result.id}/editor`);
      },
    });
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

        <ErrorBoundary
          fallback={(err, reset) => (
            <div
              class={
                "flex flex-col gap-4 justify-center items-center text-lg min-h-[300px]"
              }
            >
              An error occurred.
              {err.message}
              <Button theme={"primary"} onClick={reset}>
                Reload
              </Button>
            </div>
          )}
        >
          <div class={"mt-4"}>
            <div class={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
              <Suspense
                fallback={<LoadingCircleWithBackdrop width={32} height={32} />}
              >
                <For each={projects()}>
                  {(project) => (
                    <ProjectCard
                      onDelete={onDeleteProject}
                      onEdit={onEditProject}
                      project={project}
                    />
                  )}
                </For>
              </Suspense>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
