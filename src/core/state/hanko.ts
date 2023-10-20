import { makePlugin } from "statebuilder";
import { Hanko, register } from "@teamhanko/hanko-elements";

const hankoApi = import.meta.env.VITE_HANKO_API_URL;
const hanko = new Hanko(hankoApi);
register(hankoApi).then((r) => {});

export const withHanko = () =>
  makePlugin(
    (store, context) => {
      return {
        hanko,
        getCurrentUser() {
          return hanko.user.getCurrent();
        },
      };
    },
    { name: "hanko" },
  );
