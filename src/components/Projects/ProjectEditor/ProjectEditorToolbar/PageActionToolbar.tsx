import { provideState } from "statebuilder";
import { EditorState } from "../editorState";
import { Button } from "@codeui/kit";

export function PageActionToolbar() {
  const editorState = provideState(EditorState);

  const saveAsMarkdown = () => {
    const page = editorState.selectedPage();
    if (!page) {
      // TODO: add toast
      return alert("No selected page");
    }
    const fileName = `${page.name}.md`;
    const file = new File([(page.content as any)["content"]], fileName, {
      type: "text/markdown",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(file);
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div class={"flex gap-2"}>
      <Button
        style={{ height: "100%" }}
        onClick={saveAsMarkdown}
        size={"xs"}
        class={"h-full"}
        theme={"secondary"}
      >
        Save as Markdown
      </Button>
    </div>
  );
}
