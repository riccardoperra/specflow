import * as styles from "./HankoAuth.css";
import { onMount } from "solid-js";
import overrides from "./hanko-auth-overrides.css?raw";

// WC registered in src/core/hanko.ts

export function HankoAuth() {
  let hankoAuth: HTMLElement;

  onMount(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = overrides;
    hankoAuth.shadowRoot!.appendChild(styleElement);
  });

  return (
    <hanko-auth ref={(ref) => (hankoAuth = ref!)} class={styles.hankoAuth} />
  );
}

type GlobalJsx = JSX.IntrinsicElements;

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "hanko-auth": GlobalJsx["hanko-auth"];
    }
  }
}
