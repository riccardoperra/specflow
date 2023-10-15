import { Link } from "@solidjs/router";
import { createResource, For, Show } from "solid-js";
import { getProjects } from "../../core/services/projects";
import { Button } from "@codeui/kit";

export function Projects() {
  const links = [
    { path: "/projects", label: "Dashboard" },
    { path: "/projects", label: "Project-1" },
    { path: "/projects", label: "First item" },
  ];

  const [projects] = createResource(getProjects);

  return (
    <div class={"flex flex-col w-full"}>
      <nav
        class={
          "h-[56px] bg-[#151516] px-6 flex items-center gap-2 border-b border-b-neutral-700"
        }
      >
        <div class={"container mx-auto"}>
          <div class={"flex gap-4 text-lg"}>
            <For each={links}>
              {(link, index) => (
                <>
                  <Link
                    href={link.path}
                    classList={{
                      "text-blue-400": index() === links.length - 1,
                    }}
                    class={"font-semibold"}
                  >
                    {link.label}
                  </Link>
                  <Show when={index() + 1 < links.length}>/</Show>
                </>
              )}
            </For>
          </div>
        </div>
      </nav>

      <div class={"container mx-auto px-8 py-4 mt-12"}>
        <div class={"flex justify-between items-center"}>
          <h1 class={"text-2xl font-bold"}>My projects</h1>
          <Button theme={"primary"}>Create project</Button>
        </div>

        <div class={"mt-4"}>
          <div class={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}>
            <For each={projects()}>
              {(project) => (
                <Link
                  href={`/projects/${project.id}/editor`}
                  class={
                    "p-4 bg-neutral-800 hover:bg-neutral-700 border-b-2 rounded-md"
                  }
                >
                  <div class={"flex justify-between flex-start gap-2"}>
                    <div class={"flex-1"}>
                      <div class={"flex items-center gap-3"}>
                        <h1 class={"text-lg"}>{project.name}</h1>
                      </div>
                      <h3 class={"text-sm text-neutral-400"}>
                        {project.created_at}
                      </h3>
                    </div>
                  </div>
                </Link>
              )}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
}
