import { For, Show } from "solid-js";
import { Link, useNavigate } from "@solidjs/router";
import { ProjectView } from "../../../core/services/projects";
import { Button, IconButton } from "@codeui/kit";
import { ShareIcon } from "../../../icons/ShareIcon";
import { CurrentUserBadge } from "../../../ui/UserBadge/CurrentUserBadge";
import { LeftArrowIcon } from "../../../icons/LeftArrowIcon";
import { createBreakpoints } from "../../../core/utils/breakpoint";
import { provideState } from "statebuilder";
import { EditorState } from "./editorState";
import { MenuBars3Icon } from "../../../icons/MenuBars3Icon";

interface ProjectEditorHeaderProps {
  project: ProjectView;
}

type LinkItem = { path: string | null; label: string };

export function ProjectEditorHeader(props: ProjectEditorHeaderProps) {
  const breakpoints = createBreakpoints();
  const links = () =>
    [
      breakpoints.sm ? { path: "/projects", label: "My projects" } : null,
      { path: null, label: props.project?.name },
    ].filter((v): v is NonNullable<LinkItem> => !!v);

  const navigate = useNavigate();
  const editorState = provideState(EditorState);

  return (
    <nav class={"h-[56px] bg-[#151516] px-4 flex items-center gap-2"}>
      <div class={"flex gap-4 text-sm md:text-lg items-center"}>
        <IconButton
          theme={"secondary"}
          size={"xs"}
          pill
          aria-label={"Toggle sidebar"}
          onClick={() => editorState.actions.toggleSidebar()}
        >
          <MenuBars3Icon />
        </IconButton>

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
        {/*<Button*/}
        {/*  leftIcon={<ShareIcon class={"w-4 h-4"} />}*/}
        {/*  size={"sm"}*/}
        {/*  theme={"primary"}*/}
        {/*>*/}
        {/*  Share*/}
        {/*</Button>*/}

        <CurrentUserBadge />
      </div>
    </nav>
  );
}
