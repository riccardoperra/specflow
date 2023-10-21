import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { cookieStorage } from "./utils/cookieStorage";
import { SessionDetail } from "@teamhanko/hanko-elements";

export const supabaseCookieName = "sb-token";

const supabaseUrl = import.meta.env.VITE_CLIENT_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_CLIENT_SUPABASE_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: undefined,
    detectSessionInUrl: false,
    autoRefreshToken: false,
    persistSession: false,
    storageKey: undefined,
  },
  global: {
    headers: {
      Authorization: `Bearer ${cookieStorage.getItem(supabaseCookieName)}`,
    },
  },
});

export function patchSupabaseRestClient(accessToken: string | null) {
  const client = supabase;
  const originalHeaders = structuredClone(client["rest"]["headers"]);
  if (accessToken) {
    client["rest"].headers = {
      ...client["rest"].headers,
      Authorization: `Bearer ${accessToken}`,
    };
  } else {
    client["rest"].headers = originalHeaders;
  }
}

export function getSupabaseCookie() {
  return cookieStorage.getItem(supabaseCookieName, { path: "/", secure: true });
}

export function syncSupabaseTokenFromHankoSession(
  accessToken: string | null,
  session: SessionDetail,
) {
  if (accessToken === null) {
    cookieStorage.removeItem(supabaseCookieName);
  } else {
    // Cookie is now automatically set by the edge function
  }
}
