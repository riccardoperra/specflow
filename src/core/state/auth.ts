import { UnauthorizedError, User } from "@teamhanko/hanko-elements";
import { defineStore } from "statebuilder";
import { withProxyCommands } from "statebuilder/commands";
import { useNavigate } from "@solidjs/router";
import { withHanko, withHankoContext } from "./hanko";
import { createEffect, createMemo, on } from "solid-js";
import {
  getSupabaseCookie,
  patchSupabaseRestClient,
  syncSupabaseTokenFromHankoSession,
} from "../supabase";
import { signSupabaseToken } from "../services/auth";
import { createControlledDialog } from "../utils/controlledDialog";
import { ProfileDialog } from "../../components/Profile/ProfileDialog";
import { MOCK_AUTH_CONTEXT_KEY } from "./constants";

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

const enableAuthMock = import.meta.env.VITE_ENABLE_AUTH_MOCK;

function initialState() {
  return {
    loading: false,
    ready: false,
    supabaseAccessToken: null,
    user: null,
  };
}

export const AuthState = defineStore<State>(initialState)
  .extend(withHankoContext(enableAuthMock))
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
    const enableMock =
      context.metadata.get(MOCK_AUTH_CONTEXT_KEY) ?? (false as boolean);
    const navigate = useNavigate();
    const loggedIn = () => !!_.get.supabaseAccessToken && !!_();

    context.hooks.onInit(() => {
      _.loadCurrentUser().then((user) => {
        if (!user) {
          _.actions.setSupabaseAccessToken(null);
          navigate("/login");
        } else {
          _.actions.setSupabaseAccessToken(getSupabaseCookie());
          _.actions.setCurrent(user ?? null);
        }
        _.actions.setReady(true);
      });

      _.hanko.onAuthFlowCompleted(() => {
        _.actions.setLoading(true);
        _.loadCurrentUser().then((user) => {
          _.actions.setCurrent(user ?? null);
          signSupabaseToken(_.hanko.session.get())
            .then(({ access_token }) =>
              _.actions.setSupabaseAccessToken(access_token),
            )
            .then(() => _.actions.setLoading(false))
            .then(() => navigate("/"))
            .catch(() => {
              _.actions.setLoading(false);
              return _.hanko.user.logout().then(() => navigate("/login"));
            });
        });
      });

      createEffect(
        on(
          createMemo(() => _.get.supabaseAccessToken),
          (accessToken) => {
            patchSupabaseRestClient(accessToken);
            syncSupabaseTokenFromHankoSession(accessToken, _.session());
          },
          { defer: true },
        ),
      );

      _.hanko.onSessionCreated((session) => {
        _.actions.setSupabaseAccessToken(session.jwt!);
      });
      _.hanko.onSessionExpired(() => {
        _.actions.setSupabaseAccessToken(null);
      });
      _.hanko.onUserLoggedOut(() => {
        _.actions.setSupabaseAccessToken(null);
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
