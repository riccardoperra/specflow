import { createEffect, createSignal, on, onMount, Ref, Show } from "solid-js";

import mermaid from "mermaid";
import panzoom, { PanZoom } from "panzoom";

interface MermaidPreviewProps {
  id: string;
  content: string;
  ref?: Ref<HTMLDivElement>;
}

export function MermaidPreview(props: MermaidPreviewProps) {
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
  const id = "id-1";
  let element!: HTMLDivElement;
  let panzoomInstance: PanZoom;

  const render = async (content: string) => {
    if (panzoomInstance) {
      panzoomInstance.dispose();
    }
    const result: Error | boolean = await mermaid
      .parse(content)
      .then((_) => _)
      .catch((e) => e);

    if (result === true) {
      setErrorMessage(null);
      const svgContainer = document.querySelector(`#${id}`)! as HTMLElement;
      svgContainer.textContent = content;
      svgContainer.removeAttribute("data-processed");
      mermaid
        .run({
          nodes: [svgContainer],
        })
        .then(() => {
          queueMicrotask(() => {
            panzoomInstance = panzoom(svgContainer.firstChild as SVGElement, {
              autocenter: true,
            });
            (svgContainer.firstChild as SVGElement).classList.add(
              "cursor-move",
            );
          });
        });
    } else if (result instanceof Error) {
      setErrorMessage(result.message);
    }
  };

  onMount(() => {
    mermaid.initialize({ startOnLoad: false, theme: "dark", darkMode: true });
    createEffect(
      on(
        () => props.content,
        (content) => {
          render(content).then();
        },
      ),
    );
  });

  return (
    <div
      ref={element}
      class={"w-full h-full overflow-hidden place-items-center"}
    >
      <Show when={errorMessage()}>
        {(errorMessage) => (
          <div
            class={
              "absolute w-full h-full top-0 left-0 text-red-500 text-2xl bg-neutral-900/50 p-12"
            }
          >
            <span class={"whitespace-pre-wrap"}>{errorMessage()}</span>
          </div>
        )}
      </Show>
      <div ref={props.ref} id={id} class={"bg-neutral-800"} />
    </div>
  );
}
