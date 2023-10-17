import { provideState } from "statebuilder";
import { EditorState } from "../editorState";
import { Match, Show, Switch } from "solid-js";
import { ProjectPageView } from "../../../../core/services/projects";
import { DiagramEditor } from "../../../DiagramEditor/DiagramEditor";
import { LoadingCircle } from "../../../../icons/LoadingCircle";
import { PreviewState } from "../previewState";
import { PageEditor } from "../../../PageEditor/PageEditor";

interface DiagramEditorContentProps {
  previewMode: string;
  page: ProjectPageView;
  onValueChange: (value: string) => void;
  onSaveShortcut: () => void;
}

function DiagramEditorContent(props: DiagramEditorContentProps) {
  const previewState = provideState(PreviewState);

  return (
    <DiagramEditor
      previewMode={props.previewMode}
      pageId={props.page.id}
      content={(props.page.content as any).content}
      diagramType={(props.page.content as any).metadata.diagramType}
      onValueChange={props.onValueChange}
      onSaveShortcut={props.onSaveShortcut}
      ref={(ref) => previewState.actions.setRef(ref)}
    />
  );
}

function PageEditorContent(props: DiagramEditorContentProps) {
  return (
    <PageEditor
      previewMode={props.previewMode}
      content={(props.page.content as any).content}
      diagramType={(props.page.content as any).metadata.diagramType}
      onValueChange={props.onValueChange}
      onSaveShortcut={props.onSaveShortcut}
    />
  );
}

export function ProjectEditorContent() {
  const editorState = provideState(EditorState);

  return (
    <div class={"w-full h-full min-h-0 relative"}>
      <Show when={editorState.get.pendingUpdate}>
        <div class={"absolute right-4 top-4"}>
          <LoadingCircle />
        </div>
      </Show>

      <Show when={editorState.selectedPage()} keyed={true}>
        {(selectedPage) => (
          <div class={"h-full w-full overflow-auto bg-neutral-900"}>
            <Switch>
              <Match when={selectedPage.type === "diagram"}>
                <DiagramEditorContent
                  previewMode={editorState.get.previewMode}
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
              <Match when={selectedPage.type === "page"}>
                <PageEditorContent
                  previewMode={editorState.get.previewMode}
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
          </div>
        )}
      </Show>
    </div>
  );
}
