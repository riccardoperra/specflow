import { For, Show } from "solid-js";
import { Link } from "@solidjs/router";
import { ProjectView } from "../../../core/services/projects";
import { Button } from "@codeui/kit";

interface ProjectEditorHeaderProps {
  project: ProjectView;
}

export function ProjectEditorHeader(props: ProjectEditorHeaderProps) {
  const links = () => [
    { path: "/projects", label: "My projects" },
    { path: null, label: props.project?.name },
  ];

  return (
    <nav
      class={
        "h-[56px] bg-[#151516] px-6 flex items-center gap-2 border-b border-b-neutral-700"
      }
    >
      <div class={"flex gap-4 text-lg"}>
        <For each={links()}>
          {(link, index) => (
            <>
              <Show fallback={<span>{link.label}</span>} when={link.path}>
                <Link href={link.path!} class={"font-semibold"}>
                  {link.label}
                </Link>
              </Show>
              <Show when={index() + 1 < links().length}>/</Show>
            </>
          )}
        </For>
      </div>
      <div class={"ml-auto"}>
        <Button size={"sm"} theme={"primary"}>
          Share
        </Button>
      </div>
    </nav>
  );
}