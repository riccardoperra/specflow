import { MergeDeep } from "type-fest";
import { Database as DatabaseGenerated, Json } from "./supabase.generated";
import { PostgrestError } from "@supabase/supabase-js";

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Views: {
        project_page_view: {
          Row: {
            content: Json;
            created_at: string;
            description: string | null;
            id: string;
            name: string;
            project_id: string;
            type: string;
            user_id: string;
            owner: boolean;
          };
        };
        project_view: {
          created_at: string;
          description: string;
          id: string;
          name: string;
          user_id: string;
          owner: boolean;
        };
      };
    };
  }
>;

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Views<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }>
  ? Exclude<U, null>
  : never;

export type DbResultErr = PostgrestError;
