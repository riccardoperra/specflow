import { FlowProps, Show } from "solid-js";
import { provideState } from "statebuilder";
import { EditorState } from "../editorState";

export function ProjectEditorShowOnEditable(props: FlowProps) {
  const editorState = provideState(EditorState);
  return <Show when={!editorState.get.readonly}>{props.children}</Show>;
}
