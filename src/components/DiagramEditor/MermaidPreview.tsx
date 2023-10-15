import {
  createEffect,
  createSignal,
  createUniqueId,
  on,
  onMount,
} from "solid-js";

import mermaid from "mermaid";

interface MermaidPreviewProps {
  content: string;
}

export function MermaidPreview(props: MermaidPreviewProps) {
  const id = createUniqueId();
  let element!: HTMLDivElement;

  const render = async (content: string) => {
    const { svg, bindFunctions } = await mermaid.render(id, content);
    element.innerHTML = svg;
    bindFunctions?.(element);
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
    <div ref={element} class={"w-full flex justify-center overflow-auto"}>
      <div id={id} />
    </div>
  );
}
