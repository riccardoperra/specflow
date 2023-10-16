// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import jsonwebtoken from "jsonwebtoken";
import * as jose from "jose";

console.log("Hello from Functions!");

interface RequestBody {
  session: {
    jwt: string;
    expirationSeconds: number;
    userID: string;
  };
}

Deno.serve(async (req) => {
  const { session } = (await req.json()) as RequestBody;
  console.log(
    `Generating token for ${session.userID} with exp at ${session.expirationSeconds}`,
  );
  const hankoApiUrl = Deno.env.get("HANKO_API_URL");
  const supabaseToken = Deno.env.get("PRIVATE_KEY_SUPABASE");
  const JWKS = jose.createRemoteJWKSet(
    new URL(`${hankoApiUrl}/.well-known/jwks.json`),
  );
  const verifiedToken = await jose.jwtVerify(session.jwt, JWKS);

  const payload = {
    userId: session.userID,
    exp: new Date().setSeconds(session.expirationSeconds),
  };

  const token = jsonwebtoken.sign(payload, supabaseToken);

  return new Response(
    JSON.stringify({
      access_token: token,
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
});
