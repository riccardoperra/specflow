import { Button } from "@codeui/kit";
import { Editor } from "./Editor/Editor";

export function Home() {
  return (
    <div>
      Ciao
      <Button theme={"primary"}>Share</Button>
      <div class="w-[100vw] h-[100vh]">
        <Editor
          onSave={() => void 0}
          onValueChange={() => void 0}
          disabled={false}
          value={""}
        />
      </div>
    </div>
  );
}
