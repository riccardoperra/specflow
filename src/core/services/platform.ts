import { supabase } from "../supabase";
import { Database } from "../../types/supabase";

export type Platform =
  Database["public"]["Functions"]["get_platform_limits"]["Returns"];

export function getPlatformConfiguration() {
  return supabase
    .rpc("get_platform_limits", {})
    .then((res) => res.data) as Promise<Platform>;
}
