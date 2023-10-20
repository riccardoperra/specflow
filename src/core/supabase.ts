import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { cookieStorage } from "./utils/cookieStorage";

export const supabaseCookieName = "sb-token";

const { CLIENT_SUPABASE_URL, CLIENT_SUPABASE_KEY } = import.meta.env;

export const supabase = createClient<Database>(
  CLIENT_SUPABASE_URL,
  CLIENT_SUPABASE_KEY,
  {
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
  },
);
