import { Button } from "@codeui/kit";
import { DiagramEditor } from "./DiagramEditor/DiagramEditor";
import { createStore } from "solid-js/store";

export function Home() {
  const [content, setContent] = createStore({
    type: "diagram",
    content:
      "Alice->>+John: Hello John, how are you?\nAlice->>+John: John, can you hear me?\nJohn-->>-Alice: Hi Alice, I can hear you!\nJohn-->>-Alice: I feel great!\n\nAlice->>+John: Hello John, how are you?\nAlice->>+John: John, can you hear me?\nJohn-->>-Alice: Hi Alice, I can hear you!\nJohn-->>-Alice: I feel great!",
    metadata: {
      diagramType: "sequenceDiagram",
    },
  });

  return (
    <div class={"w-full overflow-hidden flex"}>
      <div class="h-full w-full">
        <div class={"flex flex-col gap-2 h-full"}>
          <div>
            <Button theme={"primary"}>Share</Button>
          </div>

          <div class="h-full rounded-lg overflow-auto bg-neutral-900">
            <DiagramEditor
              content={content.content}
              metadata={content.metadata}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
