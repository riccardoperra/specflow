import { makePlugin } from "statebuilder";
import {
  Hanko,
  register,
  SessionDetail,
  User,
} from "@teamhanko/hanko-elements";
import { MOCK_AUTH_CONTEXT_KEY } from "./constants";

export const hankoApi = import.meta.env.VITE_HANKO_API_URL;
const hanko = new Hanko(hankoApi);

interface WithHanko {
  hanko: Hanko;
  session: () => SessionDetail;

  getCurrentUser(): Promise<User>;
}

export const withHanko = () =>
  makePlugin(
    (_, context): WithHanko => {
      const enableMockAuth = context.metadata.get(
        MOCK_AUTH_CONTEXT_KEY,
      ) as boolean;

      context.hooks.onInit(() => {
        register(hankoApi, { enablePasskeys: !enableMockAuth }).then();
      });

      return {
        hanko,
        session() {
          return hanko.session.get();
        },
        getCurrentUser() {
          return hanko.user.getCurrent();
        },
      };
    },
    {
      name: "hanko",
      // TODO: statebuilder check dependencies is not working correctly
      // dependencies: ["hankoContext"],
    },
  );

export const withHankoContext = (mock: boolean) =>
  makePlugin(
    (_, context) => {
      // TODO: improve DX ?
      context.metadata.set(MOCK_AUTH_CONTEXT_KEY, mock);
    },
    { name: "hankoContext", dependencies: [] },
  );
