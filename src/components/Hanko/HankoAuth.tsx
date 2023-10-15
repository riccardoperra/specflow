import { createEffect } from "solid-js";
import { Hanko, register } from "@teamhanko/hanko-elements";
import "./HankoAuth.css";

const hankoApi = "https://d884cc0b-f00e-4798-9f0f-5d7645539864.hanko.io";

export function HankoAuth() {
  createEffect(() => {
    register(hankoApi, { shadow: true }).catch((error) => {
      // handle error
    });
  }, []);

  return <hanko-auth />;
}
