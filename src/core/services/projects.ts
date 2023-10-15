import { supabase } from "../supabase";
import { Database } from "../../types/supabase";

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
