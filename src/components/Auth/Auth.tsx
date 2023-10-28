import { HankoAuth } from "./HankoAuth";
import * as styles from "./Auth.css";
import { onMount, Show } from "solid-js";
import { provideState } from "statebuilder";
import { AuthState } from "../../core/state/auth";
import { LoadingCircle } from "../../icons/LoadingCircle";
import { animate, timeline, TimelineDefinition } from "motion";
import { createBreakpoints } from "../../core/utils/breakpoint";

export function Auth() {
  const auth = provideState(AuthState);
  const breakpoint = createBreakpoints();
  let element!: HTMLDivElement;
  let backdropEl!: HTMLDivElement;
  let leftContainerImage!: HTMLImageElement;
  let hankoLogoRef!: HTMLImageElement;

  // 0.25, 1, 0.5, 1 easeOutQuart
  const easeOutExpo = [0.16, 1, 0.3, 1] as const;
  onMount(() => {
    if (breakpoint.lg) {
      const tl = timeline([
        [
          element,
          {
            opacity: [0, 1],
            transform: [
              `translateY(200px) scale(0.75)`,
              `translateY(0px) scale(1)`,
            ],
          },
          { duration: 0.75, easing: easeOutExpo },
        ],
        [
          leftContainerImage,
          {
            opacity: [0.2, 1],
            transform: [`translateY(100%) scale(1)`, `translateY(0) scale(2)`],
          },
          { duration: 0.5, at: 0.35, easing: [0.22, 1, 0.36, 1] },
        ],
        [
          hankoLogoRef,
          {
            opacity: [0, 1],
            transform: [`scale(1.5)`, `translateY(0) scale(1)`],
          },
          {
            duration: 0.5,
            at: 0.6,
            easing: easeOutExpo,
          },
        ],
      ]);

      tl.finished.then(() => {
        leftContainerImage.classList.add(styles.leftContainerImage2);
      });
    } else {
      animate(
        hankoLogoRef,
        {
          opacity: [0, 1],
          transform: [`scale(1.5)`, `translateY(0) scale(1)`],
        },
        { delay: 0.2 },
      );
    }
  });

  return (
    <div
      class={`w-full h-full flex items-center justify-center ${styles.container} relative`}
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

      <div class={`relative z-1 ${styles.backdrop}`} ref={backdropEl}>
        <div
          class={`rounded-3xl flex items-stretch gap-4 ${styles.inner}`}
          ref={element}
        >
          <div class={styles.leftContainer}>
            <div
              ref={hankoLogoRef}
              class={"inline-flex flex-col items-center lg:mt-8 gap-2"}
            >
              <div class={"font-bold text-4xl"}>SpecFlow</div>
              <div class={"flex gap-2 items-center"}>
                <span class={"font-semibold"}>with</span>
                <img src={"/hanko.svg"} width={80} />
              </div>
            </div>

            <img
              class={`transform scale-150 bottom-0 absolute hidden lg:block`}
              src={"/fingerprint.svg"}
              ref={leftContainerImage}
            />
          </div>
          <div class={`w-full flex justify-center ${styles.authContainer}`}>
            <HankoAuth />
          </div>
        </div>
      </div>
    </div>
  );
}
