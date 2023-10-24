import { supabase } from "../supabase";
import { Tables, Views } from "../../types/supabase";
import { DIAGRAMS } from "../constants/diagrams";

export type ProjectPageView = Views<"project_page_view">;

export type Project = Tables<"project">;

export type ProjectView = Views<"project_view"> & {
  project_page: ProjectPageView[];
};

export async function getProjects() {
  const res = await supabase
    .from("project")
    .select("*")
    .order("created_at", { ascending: false });
  return res.data ?? [];
}

export async function getProject(id: number): Promise<ProjectView | null> {
  const res = await supabase
    .from("project_view")
    .select(`*, project_page:project_page_view(*)`)
    .eq("id", id)
    .maybeSingle();
  return res.data;
}

export async function getProjectPage(
  id: string,
): Promise<ProjectPageView | null> {
  const res = await supabase
    .from("project_page_view")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return res.data;
}

export async function deleteProject(
  // TODO: should be uuid
  id: number,
): Promise<Project | null> {
  const res = await supabase.from("project").delete().eq("id", id);
  return res.data;
}

export async function deleteProjectPage(
  id: string,
): Promise<ProjectPageView | null> {
  const res = await supabase.from("project_page").delete().eq("id", id);
  return res.data;
}

export async function createNewProject(name: string, description: string) {
  return supabase
    .from("project")
    .insert({
      name: name,
      description,
    })
    .select("*, project_page(*)")
    .single();
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
  id: number,
  data: { name: string; description: string },
) {
  return supabase
    .from("project")
    .update({ name: data.name, description: data.description })
    .eq("id", id)
    .select()
    .single();
}

export async function updateProjectPageSettings(
  id: string,
  data: { name: string; description: string },
) {
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
  return supabase
    .from("project_page")
    .update({ content })
    .eq("id", id)
    .select();
}
