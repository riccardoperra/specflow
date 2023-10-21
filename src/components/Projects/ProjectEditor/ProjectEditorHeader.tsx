import { For, Show } from "solid-js";
import { Link, useNavigate } from "@solidjs/router";
import { ProjectView } from "../../../core/services/projects";
import { Button, IconButton } from "@codeui/kit";
import { ShareIcon } from "../../../icons/ShareIcon";
import { CurrentUserBadge } from "../../UserBadge/CurrentUserBadge";
import { LeftArrowIcon } from "../../../icons/LeftArrowIcon";

interface ProjectEditorHeaderProps {
  project: ProjectView;
}

export function ProjectEditorHeader(props: ProjectEditorHeaderProps) {
  const links = () => [
    { path: "/projects", label: "My projects" },
    { path: null, label: props.project?.name },
  ];

  const navigate = useNavigate();

  return (
    <nav class={"h-[56px] bg-[#151516] px-4 flex items-center gap-2"}>
      <div class={"flex gap-4 text-lg items-center"}>
        <IconButton
          theme={"secondary"}
          size={"xs"}
          pill
          aria-label={"Go back"}
          onClick={() => navigate("/")}
        >
          <LeftArrowIcon />
        </IconButton>

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
      <div class={"ml-auto flex items-center gap-2"}>
        <Button
          leftIcon={<ShareIcon class={"w-4 h-4"} />}
          size={"sm"}
          theme={"primary"}
        >
          Share
        </Button>

        <CurrentUserBadge />
      </div>
    </nav>
  );
}
