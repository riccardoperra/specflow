import { makePlugin } from "statebuilder";
import { Hanko, register } from "@teamhanko/hanko-elements";

const hankoApi = "https://d884cc0b-f00e-4798-9f0f-5d7645539864.hanko.io";
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
