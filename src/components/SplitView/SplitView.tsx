import { createEffect, JSXElement, Show } from "solid-js";
import { gutterCol, gutterCol1, splitView } from "./SplitView.css";
import Split, { SplitInstance } from "split-grid";

interface SplitViewProps {
  mode: "left" | "right" | "both";
  left: JSXElement;
  right: JSXElement;
}

export function SplitView(props: SplitViewProps) {
  let split: SplitInstance | null;
  createEffect(() => {
    const mode = props.mode;
    if (split) {
      split.destroy(true);
    }
    if (mode === "left" || mode === "right") {
      split = null;
    } else if (mode === "both") {
      split = Split({
        columnGutters: [
          {
            track: 1,
            element: document.querySelector(`.${gutterCol1}`)!,
          },
        ],
      });
    }
  });

  return (
    <div
      class={splitView({
        mode: props.mode === "both" ? "both" : "single",
      })}
    >
      <Show when={["left", "both"].includes(props.mode)}>
        <div id={"split-view-left-panel"} class={"h-full overflow-auto"}>
          {props.left}
        </div>
      </Show>

      <Show when={props.mode === "both"}>
        <div class={`${gutterCol} ${gutterCol1}`}></div>
      </Show>

      <Show when={["both", "right"].includes(props.mode)}>
        <div id={"split-view-right-panel"} class={"h-full overflow-auto"}>
          {props.right}
        </div>
      </Show>
    </div>
  );
}
