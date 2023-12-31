import {
  createCodeMirror,
  createEditorControlledValue,
  createEditorFocus,
  createEditorReadonly,
  createLazyCompartmentExtension,
} from "solid-codemirror";
import {
  highlightActiveLine,
  highlightActiveLineGutter,
  KeyBinding,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import { VoidProps } from "solid-js";
import { theme } from "./theme";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { bracketMatching, indentOnInput } from "@codemirror/language";
import { autocompletion, closeBracketsKeymap } from "@codemirror/autocomplete";

interface JsonEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  onSave: () => void;
  disabled?: boolean;
}

export function Editor(props: VoidProps<JsonEditorProps>) {
  const { ref, createExtension, editorView } = createCodeMirror({
    onValueChange: props.onValueChange,
  });

  createEditorControlledValue(editorView, () => props.value);

  createEditorReadonly(editorView, () => props.disabled ?? false);

  createEditorFocus(editorView, (focused) => {
    if (!focused) {
      props.onSave();
    }
  });

  const saveKeymap: KeyBinding = {
    key: "Ctrl-s",
    preventDefault: true,
    run: (editor) => {
      props.onSave();
      return editor.hasFocus;
    },
  };

  createExtension([
    lineNumbers(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    indentOnInput(),
    history(),
    bracketMatching(),
    autocompletion({
      defaultKeymap: true,
      icons: true,
      aboveCursor: true,
      activateOnTyping: true,
    }),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      saveKeymap,
    ]),
  ]);

  createLazyCompartmentExtension(() => {
    return Promise.all([
      import("@codemirror/lang-javascript").then(({ javascript }) => [
        javascript({ jsx: true, typescript: true }),
      ]),
    ]);
  }, editorView);

  createExtension(theme);

  return (
    <>
      <div
        style={{
          "background-color": "#181818",
          width: "100%",
        }}
        class={"w-full h-full overflow-auto"}
        ref={ref}
      />
    </>
  );
}
