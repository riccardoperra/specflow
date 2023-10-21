export function buildMockAccessToken(userId: string) {
  const header = {
    alg: "RS256",
    kid: "d7161639-1a89-4242-b0f4-dc919c235c7d",
    typ: "JWT",
  };

  const date = new Date();
  date.setHours(1);
  const exp = date.getTime();

  const payload = {
    aud: ["http://localhost:3000"],
    exp: exp,
    iat: exp,
    sub: userId,
  };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const encodedSignature = btoa(JSON.stringify("secret"));
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}
