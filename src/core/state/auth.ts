import { UnauthorizedError, User } from "@teamhanko/hanko-elements";
import { defineSignal, defineStore } from "statebuilder";
import { withProxyCommands } from "statebuilder/commands";
import { useNavigate } from "@solidjs/router";
import { withHanko } from "./hanko";
import { createEffect, createSignal, on } from "solid-js";
import { cookieStorage } from "../utils/cookieStorage";
import { supabase, supabaseCookieName } from "../supabase";
import { signSupabaseToken } from "../services/auth";
import {
  ControlledDialogProps,
  createControlledDialog,
} from "../utils/controlledDialog";
import { ProfileDialog } from "../../components/Profile/ProfileDialog";
import { Dialog } from "@kobalte/core";

type AuthCommands = {
  setCurrent: User | null;
  setLoading: boolean;
  setReady: boolean;
  setSupabaseAccessToken: string | null;
  forceLogout: void;
};

interface State {
  user: User | null;
  loading: boolean;
  ready: boolean;
  supabaseAccessToken: string | null;
}

export const AuthState = defineStore<State>(() => ({
  loading: false,
  ready: false,
  supabaseAccessToken: null,
  user: null,
}))
  .extend(withProxyCommands<AuthCommands>({ devtools: { storeName: "auth" } }))
  .extend(withHanko())
  .extend((_) => {
    _.hold(_.commands.setCurrent, (user) => _.set("user", () => user));
    _.hold(_.commands.setLoading, (loading) => _.set("loading", () => loading));
    _.hold(_.commands.setReady, (ready) => _.set("ready", () => ready));
    _.hold(_.commands.setSupabaseAccessToken, (token) =>
      _.set("supabaseAccessToken", () => token),
    );
  })
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
    const [supabaseAccessToken, setSupabaseAccessToken] = createSignal<
      string | null
    >(null);

    const loggedIn = () => !!supabaseAccessToken() && !!_();

    context.hooks.onInit(() => {
      _.loadCurrentUser().then((user) => {
        setSupabaseAccessToken(
          cookieStorage.getItem(supabaseCookieName, { path: "/" }),
        );
        _.actions.setCurrent(user ?? null);
        _.actions.setReady(true);
        if (!user) {
          setSupabaseAccessToken(null);
          navigate("/login");
        }
      });

      _.hanko.onAuthFlowCompleted(() => {
        _.actions.setLoading(true);
        _.loadCurrentUser().then((user) => {
          _.actions.setCurrent(user ?? null);
          signSupabaseToken(_.hanko.session.get())
            .then(({ access_token }) => {
              setSupabaseAccessToken(access_token);
            })
            .then(() => _.actions.setLoading(false))
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
                path: "/",
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

    const controlledDialog = createControlledDialog();

    return {
      goToProfile() {
        controlledDialog(ProfileDialog, {});
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
