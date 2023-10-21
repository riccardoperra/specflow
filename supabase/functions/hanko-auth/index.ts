// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import jsonwebtoken from "jsonwebtoken";
import { setCookie } from "cookie";
import * as jose from "jose";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Hello from Functions!");

interface RequestBody {
  session: {
    jwt: string;
    expirationSeconds: number;
    userID: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { session } = (await req.json()) as RequestBody;
  const hankoApiUrl = Deno.env.get("HANKO_API_URL");
  const supabaseToken = Deno.env.get("PRIVATE_KEY_SUPABASE") as string;

  const skipAuth = Deno.env.get("SKIP_AUTH") ?? false;
  if (skipAuth) {
    console.log(`Bypassing authentication flow. SKIP_AUTH=true`);
    const jwtSecret = "super-secret-jwt-token-with-at-least-32-characters-long";
    const exp = new Date();
    exp.setHours(24);
    const payload = {
      userId: session.userID,
      exp: exp.getTime(),
    };
    const token = jsonwebtoken.sign(payload, jwtSecret);
    return buildSuccessResponse(token, exp);
  }

  console.log(
    `Generating token for ${session.userID} with exp at ${session.expirationSeconds}`,
  );

  try {
    const JWKS = jose.createRemoteJWKSet(
      new URL(`${hankoApiUrl}/.well-known/jwks.json`),
    );
    const data = await jose.jwtVerify(session.jwt, JWKS);
    const payload = {
      ...data.payload,
      userId: session.userID,
    };
    const token = jsonwebtoken.sign(payload, supabaseToken);
    return buildSuccessResponse(token, new Date(data.payload.exp!));
  } catch (e) {
    throw e;
  }
});

function buildSuccessResponse(token: string, expirationDate: Date) {
  const response = new Response(
    JSON.stringify({
      access_token: token,
    }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  );

  setCookie(response.headers, {
    name: "sb-token",
    value: token,
    path: "/",
    // httpOnly: true,
    secure: true,
    expires: expirationDate,
  });

  return response;
}
