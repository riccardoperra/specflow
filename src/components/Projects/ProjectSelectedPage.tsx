import { Link, useParams } from "@solidjs/router";
import { createResource, For, Show, Suspense } from "solid-js";
import { getProject, getProjectPage } from "../../core/services/projects";
import { Button } from "@codeui/kit";
import { DiagramEditor } from "../DiagramEditor/DiagramEditor";

export function ProjectSelectedPage() {
  const params = useParams<{ id: string; pageId: string }>();

  const [projectPageView] = createResource(
    () => params.pageId,
    (pageId) => getProjectPage(pageId),
  );

  return (
    <div class="w-full h-full bg-[#0f0f10]">
      <nav class={"h-[56px] bg-[#151516] px-6 flex items-center gap-2"}>
        <div class={"flex gap-2"}>
          <div class={"text-lg font-semibold"}>{"Project name"}</div>
          <span>/</span>
          <div class={"text-lg"}>{projectPageView()?.name}</div>
        </div>
      </nav>

      <Suspense>
        <Show when={projectPageView()}>
          {(page) => (
            <>
              <div class="h-full w-full">
                <div class={"flex flex-col gap-2 h-full"}>
                  <div>
                    <Button theme={"primary"}>Share</Button>
                  </div>

                  <div class="h-full rounded-lg overflow-auto bg-neutral-900">
                    <DiagramEditor
                      content={page().content.content}
                      metadata={page().content.metadata}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </Show>
      </Suspense>
    </div>
  );
}
