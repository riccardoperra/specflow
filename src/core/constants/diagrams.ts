export const DIAGRAMS = {
  sequenceDiagram: {
    name: "Sequence diagram",
    example:
      "sequenceDiagram\n" +
      "    Alice->>+John: Hello John, how are you?\n" +
      "    Alice->>+John: John, can you hear me?\n" +
      "    John-->>-Alice: Hi Alice, I can hear you!\n" +
      "    John-->>-Alice: I feel great!",
  },
  mindMap: {
    name: "Mind map",
    example:
      "mindmap\n" +
      "  root((mindmap))\n" +
      "    Origins\n" +
      "      Long history\n" +
      "      ::icon(fa fa-book)\n" +
      "      Popularisation\n" +
      "        British popular psychology author Tony Buzan\n" +
      "    Research\n" +
      "      On effectivness<br/>and features\n" +
      "      On Automatic creation\n" +
      "        Uses\n" +
      "            Creative techniques\n" +
      "            Strategic planning\n" +
      "            Argument mapping\n" +
      "    Tools\n" +
      "      Pen and paper\n" +
      "      Mermaid",
  },
  pieChart: {
    name: "Pie chart",
    example:
      "pie title Pets adopted by volunteers\n" +
      '    "Dogs" : 386\n' +
      '    "Cats" : 85\n' +
      '    "Rats" : 15',
  },
  flowChart: {
    name: "Flow chart",
    example:
      "flowchart TD\n" +
      "    A[Christmas] -->|Get money| B(Go shopping)\n" +
      "    B --> C{Let me think}\n" +
      "    C -->|One| D[Laptop]\n" +
      "    C -->|Two| E[iPhone]\n" +
      "    C -->|Three| F[fa:fa-car Car]",
  },
  requirementDiagram: {
    name: "Requirement Diagram",
    example:
      "requirementDiagram\n" +
      "\n" +
      "    requirement test_req {\n" +
      "    id: 1\n" +
      "    text: the test text.\n" +
      "    risk: high\n" +
      "    verifymethod: test\n" +
      "    }\n" +
      "\n" +
      "    element test_entity {\n" +
      "    type: simulation\n" +
      "    }\n" +
      "\n" +
      "    test_entity - satisfies -> test_req",
  },
  erDiagram: {
    name: "Er Diagram",
    example:
      "erDiagram\n" +
      "    accTitle: My Entity Relationship Diagram\n" +
      "    accDescr: My Entity Relationship Diagram Description\n" +
      "\n" +
      "    CUSTOMER ||--o{ ORDER : places\n" +
      "    ORDER ||--|{ LINE-ITEM : contains\n" +
      "    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses",
  },
};
