import { provideState } from "statebuilder";
import { EditorState } from "../editorState";
import { Match, Show, Switch } from "solid-js";
import { ProjectPageView } from "../../../../core/services/projects";
import { DiagramEditor } from "../../../DiagramEditor/DiagramEditor";

function DiagramEditorContent(props: { page: ProjectPageView }) {
  return (
    <div class="h-full w-full rounded-lg overflow-auto bg-neutral-900">
      <DiagramEditor
        content={props.page.content["content"]}
        metadata={props.page.content["metadata"]}
      />
    </div>
  );
}

export function ProjectEditorContent() {
  const editorState = provideState(EditorState);

  return (
    <div class={"w-full h-full"}>
      <Show when={editorState.selectedPage()}>
        {(selectedPage) => (
          <Switch>
            <Match when={selectedPage().type === "diagram"}>
              <DiagramEditorContent page={selectedPage()} />
            </Match>
          </Switch>
        )}
      </Show>
    </div>
  );
}
