import { provideState } from "statebuilder";
import { EditorState } from "../editorState";
import { Match, Show, Switch } from "solid-js";
import { ProjectPageView } from "../../../../core/services/projects";
import { DiagramEditor } from "../../../DiagramEditor/DiagramEditor";
import { LoadingCircle } from "../../../../icons/LoadingCircle";
import { PreviewState } from "../previewState";

interface DiagramEditorContentProps {
  page: ProjectPageView;
  onValueChange: (value: string) => void;
  onSaveShortcut: () => void;
}

function DiagramEditorContent(props: DiagramEditorContentProps) {
  const previewState = provideState(PreviewState);

  return (
    <div class="h-full w-full rounded-lg overflow-auto bg-neutral-900">
      <DiagramEditor
        content={(props.page.content as any).content}
        diagramType={(props.page.content as any).metadata.diagramType}
        onValueChange={props.onValueChange}
        onSaveShortcut={props.onSaveShortcut}
        ref={(ref) => previewState.actions.setRef(ref)}
      />
    </div>
  );
}

export function ProjectEditorContent() {
  const editorState = provideState(EditorState);

  return (
    <div class={"w-full h-full relative"}>
      <Show when={editorState.get.pendingUpdate}>
        <div class={"absolute right-4 top-4"}>
          <LoadingCircle />
        </div>
      </Show>

      <Show when={editorState.selectedPage()} keyed={true}>
        {(selectedPage) => (
          <Switch>
            <Match when={selectedPage.type === "diagram"}>
              <DiagramEditorContent
                onSaveShortcut={() => void 0}
                onValueChange={(content) => {
                  editorState.actions.updateProjectViewContent({
                    id: selectedPage.id,
                    content,
                  });
                }}
                page={selectedPage}
              />
            </Match>
          </Switch>
        )}
      </Show>
    </div>
  );
}
