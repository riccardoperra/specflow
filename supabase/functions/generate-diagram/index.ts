// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

export const generatePrompt = (
  projectName: string,
  projectDescription: string,
  pageName: string,
  prompt: string,
  diagramType: string,
) => {
  return [
    `You are generating the code for a system called ${projectName}. Description: ${projectDescription}.
     Currently the feature you are generating has a name ${pageName}.
     The code MUST BE formatted like this example and will use Mermaid syntax:
     sequenceDiagram
       Alice->>+John: Hello John, how are you?
       Alice->>+John: John, can you hear me?
       John-->>-Alice: Hi Alice, I can hear you!
       John-->>-Alice: I feel great!
     CONSIDER this is only an example of a sequence diagram and you MAY NOT USE the same participants or the same diagramType.
     All mermaid generated code MUST HAVE the type of the diagram as the first line. 
     Mermaid DOES NOT support special characters like "\\n" or "\\s" or "\\b."
    `.trim(),
    `Diagram description from the user: ${prompt}.
     YOU MUST GENERATE only the code using Mermaid syntax for a ${diagramType} diagram. No explanation or introduction.
     YOU MUST FOLLOW prompt description by the user. Use the project description only as a context for actors etc.
    `.trim(),
  ];
};

interface Request {
  projectName: string;
  projectDescription: string;
  pageName: string;
  prompt: string;
  sequenceDiagram: string;
}

Deno.serve(async (req) => {
  const token = Deno.env.get("OPENAI_TOKEN");
  const { pageName, projectDescription, projectName, prompt, sequenceDiagram } =
    (await req.json()) as Request;

  const completionConfig = {
    model: "gpt-3.5-turbo-instruct",
    prompt: generatePrompt(
      projectName,
      projectDescription,
      pageName,
      prompt,
      sequenceDiagram,
    ),
    max_tokens: 1000,
    stream: false,
  };

  return fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(completionConfig),
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'