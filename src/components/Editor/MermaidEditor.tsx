import {
  createCodeMirror,
  createEditorControlledValue,
  createEditorFocus,
  createEditorReadonly,
  createLazyCompartmentExtension,
} from "solid-codemirror";
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  KeyBinding,
  keymap,
  lineNumbers,
} from "@codemirror/view";
import { VoidProps } from "solid-js";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import {
  bracketMatching,
  HighlightStyle,
  indentOnInput,
  syntaxHighlighting,
} from "@codemirror/language";
import { autocompletion, closeBracketsKeymap } from "@codemirror/autocomplete";
import { sequenceTags } from "codemirror-lang-mermaid";
import { theme } from "./theme";
import {
  readOnlyTransactionFilter,
  disabledLineSelection,
} from "./readonly-ranges";

interface JsonEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  onSave: () => void;
  disabled?: boolean;
  type: string;
}

export function MermaidEditor(props: VoidProps<JsonEditorProps>) {
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

  const sequenceTagsTheme = HighlightStyle.define([
    { tag: sequenceTags.diagramName, color: "#8ABEB7" },
    { tag: sequenceTags.arrow, color: "#A9A9A9" },
    { tag: sequenceTags.keyword1, color: "#B58E66" },
    { tag: sequenceTags.keyword2, color: "#B58E66" },
    { tag: sequenceTags.lineComment, color: "#696969" },
    { tag: sequenceTags.messageText1, color: "#98C379" },
    { tag: sequenceTags.messageText2, color: "#98C379" },
    { tag: sequenceTags.nodeText, color: "#E06C75" },
    { tag: sequenceTags.position, color: "#D19A66" },
  ]);

  createLazyCompartmentExtension(() => {
    return Promise.all([
      import("codemirror-lang-mermaid").then(({ mermaid }) => mermaid()),
      syntaxHighlighting(sequenceTagsTheme),
    ]);
  }, editorView);

  createExtension(() => readOnlyTransactionFilter());
  createExtension(theme);

  createExtension(() => [
    EditorView.updateListener.of((vu) => {
      if (!vu.docChanged) return;
      disabledLineSelection(vu.view, 0, props.type.length + 1);
      return false;
    }),
    EditorView.theme({
      ".cm-line:first-child": {
        "user-select": "none",
        opacity: 1,
      },
      ".cm-disabled-line": {
        "user-select": "none",
      },
    }),
  ]);

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
