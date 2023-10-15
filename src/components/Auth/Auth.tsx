import { HankoAuth } from "../Hanko/HankoAuth";
import { backdrop, container, gradientBg, inner } from "./Auth.css";
import { ProjectPage } from "../Projects/ProjectPage";

export function Auth() {
  return (
    <div
      class={`w-full h-full flex items-center justify-center ${container} relative`}
    >
      <div class={`relative z-1 ${backdrop}`}>
        <div class={gradientBg} />

        <div
          class={`rounded-3xl flex bg-neutral-950 items-stretch gap-4 ${inner}`}
        >
          <div
            class={
              "rounded-lg w-[360px] bg-neutral-900 relative overflow-hidden"
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
          <div class={"p-6 font-sans w-full flex justify-center"}>
            <HankoAuth />
          </div>
        </div>
      </div>
    </div>
  );
}
