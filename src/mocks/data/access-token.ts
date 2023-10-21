export function buildMockAccessToken(userId: string) {
  const header = {
    alg: "RS256",
    kid: "d7161639-1a89-4242-b0f4-dc919c235c7d",
    typ: "JWT",
  };
  const payload = {
    aud: ["http://localhost:3000"],
    exp: 1697841690,
    iat: 1697838090,
    sub: userId,
  };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}`;
}

export function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}
