import { formatDistanceToNow } from "../../../core/utils/date";
import { Project, ProjectView } from "../../../core/services/projects";
import { Link } from "@solidjs/router";

const locale: Intl.UnicodeBCP47LocaleIdentifier = "en-US";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard(props: ProjectCardProps) {
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
      </div>
    </Link>
  );
}
