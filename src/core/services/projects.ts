import { supabase } from "../supabase";
import { Database } from "../../types/supabase";
import { DIAGRAMS } from "../constants/diagrams";

export type ProjectPageView =
  Database["public"]["Tables"]["project_page"]["Row"];

export type ProjectView = Database["public"]["Tables"]["project"]["Row"] & {
  project_page: ProjectPageView[];
};

export async function getProjects() {
  const res = await supabase.from("project").select("*");
  return res.data ?? [];
}

export async function getProject(id: number): Promise<ProjectView | null> {
  const res = await supabase
    .from("project")
    .select("*, project_page(*)")
    .eq("id", id)
    .maybeSingle();
  return res.data;
}

export async function getProjectPage(
  id: string,
): Promise<ProjectPageView | null> {
  const res = await supabase
    .from("project_page")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return res.data;
}

export async function deleteProjectPage(
  id: string,
): Promise<ProjectPageView | null> {
  const res = await supabase.from("project_page").delete().eq("id", id);
  return res.data;
}

export async function createProjectPageText(
  projectId: number,
  data: {
    name: string;
    content?: string;
  },
) {
  return supabase
    .from("project_page")
    .insert({
      name: data.name,
      description: "",
      content: {
        type: "page",
        content: "",
        metadata: {},
      },
      project_id: projectId,
      type: "page",
    })
    .select()
    .single();
}

export async function createProjectPage(
  projectId: number,
  data: {
    name: string;
    description: string;
    diagramType: keyof typeof DIAGRAMS;
    content?: string;
  },
) {
  return supabase
    .from("project_page")
    .insert({
      name: data.name,
      description: data.description,
      content: {
        type: "diagram",
        content: data.content || DIAGRAMS[data.diagramType].example,
        metadata: {
          diagramType: "sequenceDiagram",
        },
      },
      project_id: projectId,
      type: "diagram",
    })
    .select()
    .single();
}

export async function updateProjectSettings(
  id: string,
  data: { name: string; description: string },
) {
  console.log("updating id", id);
  return supabase
    .from("project_page")
    .update({ name: data.name, description: data.description })
    .eq("id", id)
    .select()
    .single();
}

export async function updateProjectContent(
  id: string,
  content: Record<string, any>,
) {
  console.log("updating id", id);
  return supabase
    .from("project_page")
    .update({ content })
    .eq("id", id)
    .select();
}
