import { SessionDetail } from "@teamhanko/hanko-elements";

export function signSupabaseToken(
  session: SessionDetail,
): Promise<{ access_token: string }> {
  const body = {
    session,
  };
  return fetch("/functions/v1/hanko-auth", {
    method: "POST",
    body: JSON.stringify(body),
  }).then((data) => data.json());
}
