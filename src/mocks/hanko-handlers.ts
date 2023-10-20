import { http, HttpResponse } from "msw";
import { buildMockAccessToken } from "./data/access-token";

const userId = "311b0b77-41c1-4750-a316-0b4c9e7cb1b3";
const emailId = crypto.randomUUID();
const userEmail = "test@example.com";
const hankoUrl = import.meta.env.VITE_HANKO_API_URL;

export const hankoHandlers = [
  http.get(`${hankoUrl}/me`, () =>
    HttpResponse.json({
      id: userId,
    }),
  ),
  http.get(`${hankoUrl}/users/${userId}`, () => {
    return HttpResponse.json({
      id: userId,
      email: userEmail,
      webauthn_credentials: null,
      updated_at: "2023-10-09T18:24:56.190105Z",
      created_at: "2023-10-09T18:24:56.189997Z",
    });
  }),
  http.post(`${hankoUrl}/user`, () => {
    return HttpResponse.json({
      id: userId,
      email_id: emailId,
      has_webauthn_credential: false,
      verified: true,
    });
  }),
  http.post(`${hankoUrl}/password/login`, async () => {
    return HttpResponse.json(null, {
      headers: {
        "X-Auth-Token": buildMockAccessToken(userId),
        "X-Session-Lifetime": "3600",
      },
    });
  }),
  http.get(`${hankoUrl}/.well-known/config`, () => {
    return HttpResponse.json({
      password: { enabled: true, min_password_length: 8 },
      emails: { require_verification: false, max_num_of_addresses: 5 },
      account: { allow_deletion: true, allow_signup: false },
    });
  }),
  http.post(`${hankoUrl}/logout`, () => {
    return HttpResponse.text(null, { status: 204 });
  }),
  http.get(`${hankoUrl}/emails`, () => {
    return HttpResponse.json([
      {
        id: emailId,
        address: userEmail,
        is_verified: true,
        is_primary: true,
        identity: null,
      },
    ]);
  }),
  http.get(`${hankoUrl}/webauthn/credentials`, () => {
    return HttpResponse.json([]);
  }),
];
