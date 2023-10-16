import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";
import { cookieStorage } from "./utils/cookieStorage";

export const supabaseCookieName = "sb-token";

export const supabase = createClient<Database>(
  "https://byxdpolwzavnqnqtyqbs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5eGRwb2x3emF2bnFucXR5cWJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEyMzM1ODAsImV4cCI6MjAwNjgwOTU4MH0.H0FWdmwAC5nkLakUDihMWKzgYBN_paeWMz8pfpisBd8",
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
