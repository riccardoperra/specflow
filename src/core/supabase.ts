import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { cookieStorage } from "./utils/cookieStorage";

export const supabaseCookieName = "sb-token";

console.log(import.meta);
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
