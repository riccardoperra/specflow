import * as styles from "./HankoProfile.css";
import overrides from "./hanko-profile-overrides.css?raw";
import { onMount } from "solid-js";

// WC registered in src/core/hanko.ts

export function HankoProfile() {
  let hankoProfile: HTMLElement;

  onMount(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = overrides;
    hankoProfile.shadowRoot!.appendChild(styleElement);
  });

  return (
    <hanko-profile
      tabindex={0} // This is needed to fix focus on dialog
      ref={(ref) => (hankoProfile = ref!)}
      class={styles.hankoProfile}
    />
  );
}

type GlobalJsx = JSX.IntrinsicElements;

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "hanko-profile": GlobalJsx["hanko-profile"];
    }
  }
}
