import { ɵdefineResource } from "statebuilder";
import { getPlatformConfiguration, Platform } from "../services/platform";
import { supabase } from "../supabase";
import { createEffect, createMemo, on } from "solid-js";
import { RealtimeChannel } from "@supabase/supabase-js";
import { withLogger } from "./plugins/withLogger";

export const PlatformState = ɵdefineResource(getPlatformConfiguration)
  .extend(withLogger({ name: "PlatformState" }))
  .extend((_, context) => {
    let subscription: RealtimeChannel | null;

    const id = createMemo(() => _()?.id);

    context.hooks.onInit(() => {
      createEffect(
        on([() => _.state, id], ([state, id]) => {
          if (state !== "ready" && !!subscription) {
            subscription.unsubscribe().then();
            subscription = null;
          }
          if (state === "ready" && id) {
            _.logger.info("Platform configuration ready", _());
            subscription = supabase.realtime
              .channel("platform")
              .on<Platform>(
                "postgres_changes",
                {
                  event: "UPDATE",
                  schema: "public",
                  table: "platform",
                  filter: `id=eq.${id}`,
                },
                (payload) => {
                  _.logger.success(
                    `Received UPDATE event for ${payload.new.id}. Updating configuration`,
                    payload.new,
                  );
                  _.set((previous) => ({ ...previous, ...payload.new }));
                },
              )
              .subscribe((status, error) => {
                if (status === "CHANNEL_ERROR") {
                  _.logger.error(`${status}`, error);
                } else {
                  _.logger.info(`Supabase channel state: ${status}`);
                }
              }, 10000);
          }
        }),
      );
    });
    context.hooks.onDestroy(() => subscription?.unsubscribe());
  });
