import { http, passthrough } from "msw";

const userId = "311b0b77-41c1-4750-a316-0b4c9e7cb1b3";
const hankoUrl = import.meta.env.VITE_HANKO_API_URL;

export const handlers = [
  http.get(
    `${hankoUrl}/me`,
    () =>
      new Response(
        JSON.stringify({
          id: userId,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
  ),
  http.get(`${hankoUrl}/users/${userId}`, () => {
    return new Response(
      JSON.stringify({
        id: userId,
        email: "perrariccardo0@gmail.com",
        webauthn_credentials: null,
        updated_at: "2023-10-09T18:24:56.190105Z",
        created_at: "2023-10-09T18:24:56.189997Z",
      }),
    );
  }),
  http.get(`${hankoUrl}/.well-known/config`, () => {
    return new Response(
      JSON.stringify({
        password: { enabled: true, min_password_length: 8 },
        emails: { require_verification: true, max_num_of_addresses: 5 },
        account: { allow_deletion: false, allow_signup: false },
      }),
    );
  }),
];
