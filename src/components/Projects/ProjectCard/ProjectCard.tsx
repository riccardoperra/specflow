import { formatDistanceToNow } from "../../../core/utils/date";
import {
  Project,
  ProjectView,
  deleteProject,
} from "../../../core/services/projects";
import { Link } from "@solidjs/router";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  IconButton,
} from "@codeui/kit";
import { As } from "@kobalte/core";
import { EllipsisIcon } from "../../../icons/EllipsisIcon";
import { createControlledDialog } from "../../../core/utils/controlledDialog";
import { ConfirmDialog } from "../../../ui/ConfirmDialog/ConfirmDialog";
import { createSignal } from "solid-js";
import { ProjectEditSettingsDialog } from "../ProjectEditSettingsDialog/ProjectEditSettingsDialog";

const locale: Intl.UnicodeBCP47LocaleIdentifier = "en-US";

interface ProjectCardProps {
  project: Project;
  onDelete: (project: Project) => void;
  onEdit: (project: Project) => void;
}

export function ProjectCard(props: ProjectCardProps) {
  const controlledDialog = createControlledDialog();

  const onEdit = () => controlledDialog(ProjectEditSettingsDialog, {
    onSave: props.onEdit,
    project: props.project
  });

  const onDelete = () => {
    controlledDialog(ConfirmDialog, (openChange) => {
      const [loading, setLoading] = createSignal(false);
      return {
        title: "Delete project",
        message: "The action is not reversible.",
        onConfirm: () => {
          setLoading(true);
          deleteProject(props.project.id)
            .then(() => setLoading(false))
            .then(() => props.onDelete(props.project))
            .finally(() => openChange(false));
        },
        closeOnConfirm: false,
        loading: loading,
        actionType: "danger" as const,
      };
    });
  };

  const createdAt = () => {
    return formatDistanceToNow(locale, props.project.created_at as string);
  };

  return (
    <Link
      href={`/projects/${props.project.id}/editor`}
      class={
        "p-4 bg-neutral-800 hover:bg-neutral-700 rounded-md shadow-lg transition"
      }
    >
      <div class={"flex justify-between flex-start gap-2"}>
        <div class={"flex-1"}>
          <div class={"flex items-center gap-3"}>
            <h1 class={"text-lg font-medium"}>{props.project.name}</h1>
          </div>
          <h3 class={"text-sm text-neutral-400 mt-2"}>Created {createdAt()}</h3>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <As
                theme={"secondary"}
                size={"sm"}
                component={IconButton}
                aria-label={"Menu"}
              >
                <EllipsisIcon size="1.3rem" />
              </As>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </div>
      </div>
    </Link>
  );
}
