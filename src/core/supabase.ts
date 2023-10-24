import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { cookieStorage } from "./utils/cookieStorage";
import { SessionDetail } from "@teamhanko/hanko-elements";

export const supabaseCookieName = "sb-token";

const supabaseUrl = import.meta.env.VITE_CLIENT_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_CLIENT_SUPABASE_KEY;

const initialToken = getSupabaseCookie();
const supabaseToken = initialToken ?? supabaseKey;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: undefined,
    detectSessionInUrl: false,
    autoRefreshToken: false,
    persistSession: false,
    storageKey: undefined,
  },
  // TODO: This is commented in order to have the original headers valuated
  // with the supabaseKey.
  // global: {
  // headers: initialToken ? { Authorization: `Bearer ${initialToken}` } : {},
  // },
});

const originalHeaders = structuredClone(supabase["rest"].headers);

export function patchSupabaseRestClient(accessToken: string | null) {
  supabase.functions.setAuth(accessToken ?? supabaseToken);
  if (accessToken) {
    supabase["rest"].headers = {
      ...supabase["rest"].headers,
      Authorization: `Bearer ${accessToken}`,
    };
  } else {
    supabase["rest"].headers = originalHeaders;
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
    const currentDate = new Date();
    const expirationDate = new Date(
      currentDate.getTime() + session.expirationSeconds * 1000,
    );
    cookieStorage.setItem(supabaseCookieName, accessToken, {
      expires: expirationDate.getTime(),
      secure: true,
      path: "/",
    });
  }
}
