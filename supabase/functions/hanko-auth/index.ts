// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import jsonwebtoken from "jsonwebtoken";
import { getCookies, setCookie } from "cookie";
import * as jose from "jose";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const hankoToken = ((await req.json()) ?? {}).token as string | null;

  console.log("Received token ->", hankoToken);

  if (!hankoToken) {
    return new Response(
      JSON.stringify({ code: 401, message: "Unauthorized" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      },
    );
  }

  const hankoApiUrl = Deno.env.get("HANKO_API_URL");
  const supabaseToken = Deno.env.get("PRIVATE_KEY_SUPABASE") as string;

  const skipAuth = Deno.env.get("SKIP_AUTH") ?? false;
  if (skipAuth) {
    const jwt = jose.decodeJwt(hankoToken);
    console.log(
      `Bypassing authentication flow for user ${jwt.sub}. SKIP_AUTH=true`,
    );
    const token = await buildMockToken(jwt);
    return buildSuccessResponse(token, jwt.exp!);
  }

  try {
    const JWKS = jose.createRemoteJWKSet(
      new URL(`${hankoApiUrl}/.well-known/jwks.json`),
    );
    const data = await jose.jwtVerify(hankoToken, JWKS);
    console.log(data);
    const payload = {
      exp: data.payload.exp,
      userId: data.payload.sub,
    };
    const token = jsonwebtoken.sign(payload, supabaseToken);
    return buildSuccessResponse(token, data.payload.exp!);
  } catch (e) {
    throw e;
  }
});

function buildMockToken(jwt: jose.JWTPayload) {
  const jwtSecret = "super-secret-jwt-token-with-at-least-32-characters-long";
  const payload = buildPayload(jwt.exp!, jwt.sub!);
  return new jose.SignJWT(payload)
    .setExpirationTime(payload.exp)
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(jwtSecret));
}

function buildPayload(exp: number, sub: string) {
  return { exp: exp, userId: sub };
}

function buildSuccessResponse(token: string, exp: number) {
  const response = new Response(JSON.stringify({ access_token: token }), {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

  setCookie(response.headers, {
    name: "sb-token",
    value: token,
    path: "/",
    // httpOnly: true,
    secure: true,
    maxAge: exp,
  });

  return response;
}
