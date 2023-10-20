import { HankoAuth } from "../Hanko/HankoAuth";
import { authContainer, backdrop, container, inner } from "./Auth.css";
import { Show } from "solid-js";
import { provideState } from "statebuilder";
import { AuthState } from "../../core/state/auth";
import { LoadingCircle } from "../../icons/LoadingCircle";

export function Auth() {
  const auth = provideState(AuthState);
  return (
    <div
      class={`w-full h-full flex items-center justify-center ${container} relative`}
    >
      <Show when={auth.get.loading}>
        <div
          class={
            "absolute left-0 top-0 flex items-center justify-center w-full h-full z-50 bg-neutral-900/70"
          }
        >
          <LoadingCircle width={32} height={32} />
        </div>
      </Show>

      <div class={`relative z-1 ${backdrop}`}>
        <div
          class={`rounded-3xl flex bg-neutral-950 items-stretch gap-4 ${inner}`}
        >
          <div
            class={
              "rounded-lg w-[360px] bg-neutral-900 relative overflow-hidden hidden lg:block"
            }
          >
            <img
              class={"transform scale-150 bottom-0 absolute"}
              src={"/undraw_fingerprint_re_uf3f.svg"}
            />
            <img
              class={"transform scale-150 bottom-50 absolute"}
              src={"/undraw_safe_re_kiil.svg"}
            />
          </div>
          <div class={`w-full flex justify-center ${authContainer}`}>
            <HankoAuth />
          </div>
        </div>
      </div>
    </div>
  );
}
