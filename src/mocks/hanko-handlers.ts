import { http, HttpResponse } from "msw";
import { buildMockAccessToken } from "./data/access-token";
import {
  buildHankoNotAuthorizedResponse,
  buildHankoNotFoundResponse,
  buildResponseForToken,
  buildUser,
  findUserByEmail,
  findUserById,
  getUserByCookies,
  type HankoConfigResponse,
  type HankoCurrentUserResponse,
  type HankoEmailResponse,
  type HankoInitializePasscodeChallengeResponse,
  type HankoNotFoundResponse,
  type HankoUnauthorizedResponse,
  type HankoUserInfoResponse,
} from "./data/hanko";
import { logger } from "./data/log";

const ENABLE_PASSCODE_FLOW = true;

const hankoUrl = import.meta.env.VITE_HANKO_API_URL as string;

const getWellKnownConfig = http.get<{}, {}, HankoConfigResponse>(
  `${hankoUrl}/.well-known/config`,
  async () => {
    return HttpResponse.json({
      password: { enabled: !ENABLE_PASSCODE_FLOW, min_password_length: 0 },
      emails: { require_verification: false, max_num_of_addresses: 5 },
      account: { allow_deletion: true, allow_signup: false },
      providers: [],
      use_enterprise: false,
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

const usersByUserId = http.get<
  {
    userId: string;
  },
  {},
  HankoNotFoundResponse | any
>(`${hankoUrl}/users/:userId`, ({ params }) => {
  const { userId } = params;
  const user = buildUser(findUserById(userId as string));
  if (!user) {
    return buildHankoNotFoundResponse();
  }
  return HttpResponse.json(user);
});

const initializePasscodeChallenge = http.post<
  {},
  { user_id: string },
  HankoInitializePasscodeChallengeResponse | HankoNotFoundResponse
>(`${hankoUrl}/passcode/login/initialize`, async ({ request }) => {
  const { user_id } = await request.json();
  const userInfo = findUserById(user_id)!;
  const user = buildUser(userInfo);
  if (!user) {
    return buildHankoNotFoundResponse();
  }
  return HttpResponse.json({
    id: user_id,
    ttl: 300,
    created_at: new Date().toISOString(),
  } as HankoInitializePasscodeChallengeResponse);
});

const finalizePasscodeChallenge = http.post<
  {},
  { id: string; code: string },
  | HankoInitializePasscodeChallengeResponse
  | HankoNotFoundResponse
  | HankoUnauthorizedResponse
>(`${hankoUrl}/passcode/login/finalize`, async ({ request }) => {
  const { id, code } = await request.json();
  const userInfo = findUserById(id)!;
  const user = buildUser(userInfo);
  if (!user) {
    return buildHankoNotFoundResponse();
  }
  if (code !== userInfo.passcode) {
    return buildHankoNotAuthorizedResponse();
  }
  return buildResponseForToken(
    {
      id,
      ttl: 300,
      created_at: new Date().toISOString(),
    } satisfies HankoInitializePasscodeChallengeResponse,
    buildMockAccessToken(user.id),
  );
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
    return buildResponseForToken(null, buildMockAccessToken(user.id));
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
  initializePasscodeChallenge,
  finalizePasscodeChallenge,
  getCurrentUserEmails,
  getCurrentUserCredentials,
];
