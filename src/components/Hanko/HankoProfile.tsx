import { createEffect } from "solid-js";
import { register } from "@teamhanko/hanko-elements";

const hankoApi = "https://d884cc0b-f00e-4798-9f0f-5d7645539864.hanko.io";

export function HankoProfile() {
  createEffect(() => {
    register(hankoApi, { enablePasskeys: false }).catch((error) => {
      // handle error
    });
  }, []);

  return <hanko-profile />;
}
