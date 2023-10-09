import {Hanko, UnauthorizedError, User} from "@teamhanko/hanko-elements";
import {defineSignal} from "statebuilder";
import {withProxyCommands} from "statebuilder/commands";
import {useNavigate} from "@solidjs/router";

const hankoApi = 'https://d884cc0b-f00e-4798-9f0f-5d7645539864.hanko.io';

const hanko = new Hanko(hankoApi);

type AuthCommands = {
  setCurrent: User | null;
  forceLogout: void;
}

export const AuthState = defineSignal<User | null>(() => null)
  .extend(withProxyCommands<AuthCommands>())
  .extend(_ => _
    .hold(_.commands.setCurrent, (user) => _.set(() => user))
  )
  .extend((_) => ({
    loadUser() {
      return hanko.user.getCurrent()
        .then(_.actions.setCurrent)
        .catch((e) => {
          if (e instanceof UnauthorizedError) {
            _.actions.setCurrent(null);
          }
        });
    }
  }))
  .extend((_, context) => {
    const navigate = useNavigate();

    context.hooks.onInit(() => {
      _.loadUser();

      hanko.onAuthFlowCompleted(() => {
        _.loadUser().then(() => {
          navigate('/');
        });
      });

      _.watchCommand([_.commands.setCurrent])
        .subscribe((command) => {
          const user = _();
          if (!user) {
            navigate('/login');
          }
        });
    })

    return {};
  });
