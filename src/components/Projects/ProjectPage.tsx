import { Link, useParams } from "@solidjs/router";
import { createResource, For, Show, Suspense } from "solid-js";
import { getProject } from "../../core/services/projects";

export function ProjectPage() {
  const params = useParams<{ id: string }>();

  const [projectView] = createResource(() => Number(params.id), getProject);

  return (
    <div class="py-8 px-6 bg-neutral-700 h-full">
      <Suspense>
        <Show when={projectView()}>
          {(project) => (
            <>
              <div>
                <div class="rounded-3xl p-12 min-h-[200px] bg-neutral-800">
                  <h1 class="text-4xl font-bold">{project().name}</h1>
                  <h3 class="text-md mt-6">{project().description}</h3>
                </div>
              </div>

              <div class="my-6">
                <h4 class="text-2xl font-medium">Pages</h4>
              </div>

              <div class={"grid grid-cols-3 gap-4 mt-4"}>
                <For each={project().project_page}>
                  {(projectPage) => (
                    <div
                      class={
                        "block w-full p-8 bg-neutral-800 border-neutral-500 rounded-2xl hover:shadow-outline hover:shadow-blue-500 relative"
                      }
                    >
                      <Link
                        class={"absolute left-0 top-0 w-full h-full"}
                        href={`/projects/${project().id}/page/${
                          projectPage.id
                        }`}
                      />

                      <div>
                        <span class="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-lg uppercase">
                          {projectPage.type}
                        </span>
                      </div>

                      <h5 class="mt-4 mb-2 text-2xl font-semibold tracking-tight text-neutral-200">
                        {projectPage.name}
                      </h5>

                      <p
                        class="font-normal"
                        classList={{
                          "text-neutral-300": !!projectPage.description,
                          "text-neutral-400": !projectPage.description,
                        }}
                      >
                        {projectPage.description ?? "No description"}
                      </p>

                      <div class="flex justify-start mt-4 border-t pt-4 pb-2">
                        <span class="font-normal text-neutral-400">
                          Created {projectPage.created_at}
                        </span>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </>
          )}
        </Show>
      </Suspense>
    </div>
  );
}
