import { http, HttpResponse } from "msw";
import { buildMockAccessToken } from "./data/access-token";
import {
  buildHankoNotAuthorizedResponse,
  buildHankoNotFoundResponse,
  buildUser,
  findUserByEmail,
  findUserById,
  getUserByCookies,
  type HankoConfigResponse,
  type HankoCurrentUserResponse,
  type HankoEmailResponse,
  type HankoNotFoundResponse,
  type HankoUnauthorizedResponse,
  type HankoUserInfoResponse,
} from "./data/hanko";
import { logger } from "./data/log";

const hankoUrl = import.meta.env.VITE_HANKO_API_URL as string;

const getWellKnownConfig = http.get<{}, {}, HankoConfigResponse>(
  `${hankoUrl}/.well-known/config`,
  () => {
    return HttpResponse.json({
      password: { enabled: true, min_password_length: 0 },
      emails: { require_verification: false, max_num_of_addresses: 5 },
      account: { allow_deletion: true, allow_signup: false },
      providers: [],
    });
  },
);

const me = http.get<
  {},
  {},
  HankoCurrentUserResponse | HankoUnauthorizedResponse
>(`${hankoUrl}/me`, async ({ cookies }) => {
  const user = getUserByCookies(cookies);
  if (!user) {
    return buildHankoNotAuthorizedResponse();
  }
  logger.success(`[MSW/Hanko] Found user ${user.id} from cookies`, {
    user,
  });
  return HttpResponse.json({
    id: user.id,
  });
});

const usersByUserId = http.get(`${hankoUrl}/users/:userId`, ({ params }) => {
  const { userId } = params;
  const user = buildUser(findUserById(userId as string));
  if (!user) {
    return HttpResponse.json(
      { code: 404, message: "Not Found" } as unknown as null,
      { status: 404 },
    );
  }
  return HttpResponse.json(user);
});

const userInfoByEmail = http.post<
  {},
  { email: string },
  HankoUserInfoResponse | HankoNotFoundResponse
>(`${hankoUrl}/user`, async ({ request }) => {
  const { email } = await request.json();
  logger.info(`[MSW/Hanko] Retrieving user by email: ${email}`);
  const user = buildUser(findUserByEmail(email));
  if (!user) {
    return buildHankoNotFoundResponse();
  }
  logger.success(`[MSW/Hanko] User ${user.id} found`, { user });
  return HttpResponse.json({
    id: user.id,
    email_id: user.email,
    verified: true,
    has_webauthn_credential: true,
  });
});

const login = http.post<{}, { user_id: string; password: string }>(
  `${hankoUrl}/password/login`,
  async ({ request }) => {
    const { user_id, password } = await request.json();
    logger.info(`[MSW/Hanko] Login flow for user ${user_id}`);
    const user = findUserById(user_id);
    logger.success(`[MSW/Hanko] User ${user_id} found`, { user });
    if (!user) {
      return buildHankoNotFoundResponse();
    }
    if (user.password !== password) {
      return buildHankoNotAuthorizedResponse();
    }
    return HttpResponse.json(null, {
      headers: {
        "X-Auth-Token": buildMockAccessToken(user.id),
        "X-Session-Lifetime": "3600",
      },
    });
  },
);

const logout = http.post(`${hankoUrl}/logout`, () => {
  return HttpResponse.text(null, { status: 204 });
});

const getCurrentUserEmails = http.get<
  {},
  {},
  HankoUnauthorizedResponse | HankoEmailResponse[]
>(`${hankoUrl}/emails`, ({ cookies }) => {
  const user = getUserByCookies(cookies);
  if (!user) {
    return buildHankoNotAuthorizedResponse();
  }
  return HttpResponse.json([
    {
      id: user.emailId,
      address: user.email,
      is_verified: true,
      is_primary: true,
      identity: null,
    } as {} as HankoEmailResponse,
  ]);
});

const getCurrentUserCredentials = http.get(
  `${hankoUrl}/webauthn/credentials`,
  () => {
    return HttpResponse.json([]);
  },
);

export const hankoHandlers = [
  me,
  usersByUserId,
  userInfoByEmail,
  login,
  getWellKnownConfig,
  logout,
  getCurrentUserEmails,
  getCurrentUserCredentials,
];
