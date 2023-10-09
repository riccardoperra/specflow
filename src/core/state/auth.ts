import { Hanko, UnauthorizedError, User } from "@teamhanko/hanko-elements";
import { defineSignal } from "statebuilder";
import { withProxyCommands } from "statebuilder/commands";
import { useNavigate } from "@solidjs/router";
import { withHanko } from "./hanko";
import { createEffect, getOwner, on, runWithOwner } from "solid-js";

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
      return _.getCurrentUser()
        .then(_.actions.setCurrent)
        .catch((e) => {
          if (e instanceof UnauthorizedError) {
            _.actions.setCurrent(null);
          }
        });
    },
  }))
  .extend((_, context) => {
    const navigate = useNavigate();
    const owner = getOwner();

    context.hooks.onInit(() => {
      _.loadCurrentUser().then(() => {
        runWithOwner(owner, () =>
          createEffect(
            on(_, (user) => {
              navigate(user ? "/" : "/login");
            }),
          ),
        );
      });

      _.hanko.onAuthFlowCompleted(() => {
        _.loadCurrentUser();

        _.watchCommand([_.commands.setCurrent]).subscribe((command) => {
          const user = _();
          if (!user) {
            navigate("/login");
          }
        });
      });
    });

    return {};
  });
