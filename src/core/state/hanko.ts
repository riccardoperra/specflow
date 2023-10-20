import { makePlugin } from "statebuilder";
import {
  Hanko,
  register,
  SessionDetail,
  User,
} from "@teamhanko/hanko-elements";
import { MOCK_AUTH_CONTEXT_KEY } from "./constants";

const hankoApi = import.meta.env.VITE_HANKO_API_URL;
const hanko = new Hanko(hankoApi);
register(hankoApi).then((r) => {});

interface WithHanko {
  hanko: Hanko;
  session: () => SessionDetail;

  getCurrentUser(): Promise<User>;
}

const withHankoMockAuth = (): WithHanko => {
  const session = () =>
    ({
      expirationSeconds: 0,
      jwt: undefined,
      userID: "311b0b77-41c1-4750-a316-0b4c9e7cb1b3",
    }) as SessionDetail;

  return {
    hanko,
    session,
    getCurrentUser() {
      return hanko.user.getCurrent();
    },
  };
};

const withHankoAuth = (): WithHanko => {
  return {
    hanko,
    session() {
      return hanko.session.get();
    },
    getCurrentUser() {
      return hanko.user.getCurrent();
    },
  };
};

export const withHanko = () =>
  makePlugin(
    (_, context) => {
      const enableMockAuth = context.metadata.get(
        MOCK_AUTH_CONTEXT_KEY,
      ) as boolean;
      return enableMockAuth ? withHankoMockAuth() : withHankoAuth();
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
