import { SessionDetail } from "@teamhanko/hanko-elements";
import { supabase } from "../supabase";

export function signSupabaseToken(
  session: SessionDetail,
): Promise<{ access_token: string }> {
  return supabase.functions
    .invoke("hanko-auth", {
      body: session,
    })
    .then((res) => res.data);
}
