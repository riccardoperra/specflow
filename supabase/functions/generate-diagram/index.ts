// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { corsHeaders } from "../_shared/cors.ts";

export const generatePrompt = (
  projectName: string,
  projectDescription: string,
  pageName: string,
  prompt: string,
  diagramType: string,
) => {
  return [
    `You are generating the code for a system called ${projectName}. Description: ${projectDescription}.
     Mermaid DOES NOT support special characters like "\\n" or "\\s" or "\\b."
     Diagram description from the user: ${prompt}.
     Title should be: ${pageName}
     YOU MUST GENERATE only the code using Mermaid syntax for a ${diagramType} diagram. Only code, no explanation or introduction.
  
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
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

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
      ...corsHeaders,
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
