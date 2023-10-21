import { SessionDetail } from "@teamhanko/hanko-elements";
import { supabase } from "../supabase";

export function signSupabaseToken(
  session: SessionDetail,
): Promise<{ access_token: string; expiration_date: number }> {
  return supabase.functions
    .invoke("hanko-auth", {
      body: { token: session.jwt },
    })
    .then((res) => res.data);
}
