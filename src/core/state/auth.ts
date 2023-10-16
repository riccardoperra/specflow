import { UnauthorizedError, User } from "@teamhanko/hanko-elements";
import { defineSignal } from "statebuilder";
import { withProxyCommands } from "statebuilder/commands";
import { useNavigate } from "@solidjs/router";
import { withHanko } from "./hanko";
import { createEffect, createSignal, on } from "solid-js";
import { cookieStorage } from "../utils/cookieStorage";
import { supabase, supabaseCookieName } from "../supabase";
import { signSupabaseToken } from "../services/auth";

type AuthCommands = {
  setCurrent: User | null;
  forceLogout: void;
};

export const AuthState = defineSignal<User | null>(() => null)
  .extend(withProxyCommands<AuthCommands>())
  .extend(withHanko())
  .extend((_) => _.hold(_.commands.setCurrent, (user) => _.set(() => user)))
  .extend((_) => ({
    loadCurrentUser() {
      return _.getCurrentUser().catch((e) => {
        if (e instanceof UnauthorizedError) {
          return null;
        }
      });
    },
  }))
  .extend((_, context) => {
    const navigate = useNavigate();
    const [ready, setReady] = createSignal(false);
    const [supabaseAccessToken, setSupabaseAccessToken] = createSignal<
      string | null
    >(null);

    const loggedIn = () => !!supabaseAccessToken() && !!_();

    context.hooks.onInit(() => {
      _.loadCurrentUser().then((user) => {
        setSupabaseAccessToken(cookieStorage.getItem(supabaseCookieName));
        _.actions.setCurrent(user ?? null);
        setReady(true);
        if (!user) {
          navigate("/login");
        }
      });

      _.hanko.onAuthFlowCompleted(() => {
        _.loadCurrentUser().then((user) => {
          _.actions.setCurrent(user ?? null);
          signSupabaseToken(_.hanko.session.get())
            .then(({ access_token }) => {
              setSupabaseAccessToken(access_token);
            })
            .then(() => navigate("/"));
        });
      });

      // Supabase sync token integration

      createEffect(
        on(
          supabaseAccessToken,
          (accessToken) => {
            const client = supabase;
            const originalHeaders = structuredClone(client["rest"]["headers"]);
            if (accessToken === null) {
              cookieStorage.removeItem(supabaseCookieName);
              setSupabaseAccessToken(null);
              client["rest"].headers = originalHeaders;
            } else {
              const currentDate = new Date();
              const expirationDate = new Date(
                currentDate.getTime() +
                  _.hanko.session.get().expirationSeconds * 1000,
              );
              cookieStorage.setItem(supabaseCookieName, accessToken, {
                expires: expirationDate.getTime(),
                secure: true,
              });
              client["rest"].headers = {
                ...client["rest"].headers,
                Authorization: `Bearer ${accessToken}`,
              };
            }
          },
          { defer: true },
        ),
      );

      _.hanko.onSessionCreated((session) => {
        setSupabaseAccessToken(session.jwt!);
      });
      _.hanko.onSessionExpired(() => {
        setSupabaseAccessToken(null);
      });
      _.hanko.onUserLoggedOut(() => {
        setSupabaseAccessToken(null);
      });
    });

    return {
      ready,
      goToProfile() {
        return navigate("/profile");
      },
      loggedIn,
      logout() {
        return _.hanko.user
          .logout()
          .then(() => navigate("/login"))
          .catch((e) => {
            console.error("Error during logout:", e);
            // TODO add toast
            alert("Error while logout");
          });
      },
    };
  });
