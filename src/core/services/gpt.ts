import { ProjectPageView, ProjectView } from "./projects";
import OpenAI from "openai";
import Completion = OpenAI.Completion;

export async function generateNewMermaidDiagramCode(
  project: ProjectView,
  page: {
    name: string;
    description: string;
    diagramType: string | null;
  },
  prompt: string,
): Promise<Completion> {
  const body = {
    projectName: project.name,
    projectDescription: project.description,
    pageName: page.name,
    diagramType: page.diagramType,
    prompt,
  };
  return fetch("/functions/v1/generate-diagram", {
    method: "POST",
    body: JSON.stringify(body),
  }).then((data) => data.json());
}

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
    diagramType: (page.content as any)["metadata"]["diagramType"],
    prompt,
  };
  return fetch("/functions/v1/generate-diagram", {
    method: "POST",
    body: JSON.stringify(body),
  }).then((data) => data.json());
}
