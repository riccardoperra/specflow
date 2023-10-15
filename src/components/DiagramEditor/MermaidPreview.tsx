import { createEffect, createSignal, on, onMount, Ref, Show } from "solid-js";

import mermaid from "mermaid";

interface MermaidPreviewProps {
  content: string;
  ref?: Ref<HTMLDivElement>;
}

export function MermaidPreview(props: MermaidPreviewProps) {
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
  const id = "id-1";
  let element!: HTMLDivElement;

  const render = async (content: string) => {
    const result: Error | boolean = await mermaid
      .parse(content)
      .then((_) => _)
      .catch((e) => e);

    if (result === true) {
      setErrorMessage(null);
      document.querySelector(`#${id}`)!.textContent = content;
      document.querySelector(`#${id}`)!.removeAttribute("data-processed");
      mermaid.run({
        nodes: [document.querySelector(`#${id}`)!],
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
      class={
        "w-full h-full flex justify-center overflow-auto relative place-items-center"
      }
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
