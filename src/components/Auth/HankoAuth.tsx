import * as styles from "./HankoAuth.css";

export function HankoAuth() {
  return (
    // @ts-expect-error TODO: discover how to fix the "hanko-auth" does not exists in jsx element
    <hanko-auth class={styles.hankoAuth} />
  );
}
