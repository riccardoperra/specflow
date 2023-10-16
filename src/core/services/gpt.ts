import { ProjectPageView, ProjectView } from "./projects";

export async function generateMermaidDiagramCode(
  project: ProjectView,
  page: ProjectPageView,
  prompt: string,
) {
  const body = {
    projectName: project.name,
    projectDescription: project.description,
    pageName: page.name,
    // TODO fix type
    diagramType: page.content["metadata"]["diagramType"],
    prompt,
  };
  return fetch("/functions/v1/generate-diagram", {
    method: "POST",
    body: JSON.stringify(body),
  }).then((data) => data.json());
}
