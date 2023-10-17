import { createEffect, createSignal, on, onCleanup } from "solid-js";
import { Editor, EditorOptions } from "@tiptap/core";
import { TIPTAP_PLUGINS } from "./tiptap-plugins";

export type BaseEditorOptions = Omit<Partial<EditorOptions>, "element">;

export interface UseEditorOptions<T extends HTMLElement>
  extends BaseEditorOptions {
  element: T;
}

export function createEditor<T extends HTMLElement>(
  props: () => UseEditorOptions<T>,
): () => Editor | undefined {
  const [signal, setSignal] = createSignal<Editor>();

  createEffect(() => {
    const instance = new Editor({
      ...props(),
    });

    onCleanup(() => {
      instance.destroy();
    });

    setSignal(instance);
  });

  return signal;
}

interface PageEditorPreviewProps {
  content: string;
}

export const TIPTAP_ATTRIBUTE_CLASSES =
  "prose-lg prose-stone dark:prose-invert prose-headings:font-display font-default focus:outline-none max-w-full";

export function PageEditorPreview(props: PageEditorPreviewProps) {
  let ref!: HTMLDivElement;

  const editor = createEditor(() => ({
    element: ref!,
    extensions: TIPTAP_PLUGINS,
    editable: false,
    autofocus: false,
    content: props.content,
    editorProps: {
      attributes: {
        class: TIPTAP_ATTRIBUTE_CLASSES,
      },
    },
  }));

  createEffect(
    on(
      () => props.content,
      (content) => editor()?.commands?.setContent(content),
    ),
  );

  return <div id="editor" ref={ref} />;
}
