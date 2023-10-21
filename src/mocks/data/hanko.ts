import { HttpResponse, StrictResponse } from "msw";
import { parseJwt } from "./access-token";
import { logger } from "./log";
import type {
  Email as HankoEmailResponse,
  UserInfo as HankoUserInfoResponse,
  Config as HankoConfigResponse,
} from "@teamhanko/hanko-elements";

export type { HankoEmailResponse, HankoUserInfoResponse, HankoConfigResponse };

interface UserInfo {
  id: string;
  email: string;
  emailId: string;
  password: string;
}

export const hankoUsers = {
  user1: {
    id: "311b0b77-41c1-4750-a316-0b4c9e7cb1b3",
    email: "user1@example.com",
    password: "password",
    emailId: crypto.randomUUID(),
  },
  user2: {
    id: "a405e378-066d-45f4-88b5-55d375064e4",
    email: "user2@example.com",
    password: "password",
    emailId: crypto.randomUUID(),
  },
} as Record<string, UserInfo>;

export function findUserById(id: string) {
  return Object.values(hankoUsers).find((user) => user.id === id);
}

export function findUserByEmail(email: string) {
  return Object.values(hankoUsers).find((hanko) => hanko.email === email);
}

export function buildUser(user: UserInfo | null | undefined) {
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    email: user.email,
    webauthn_credentials: null,
    updated_at: "2023-10-09T18:24:56.190105Z",
    created_at: "2023-10-09T18:24:56.189997Z",
  };
}

export interface HankoNotFoundResponse {
  code: 404;
  message: "Not Found";
}

export interface HankoUnauthorizedResponse {
  code: 401;
  message: "Unauthorized";
}

export function buildHankoNotFoundResponse(): StrictResponse<HankoNotFoundResponse> {
  return HttpResponse.json(
    { code: 404, message: "Not Found" },
    { status: 404 },
  );
}

export function buildHankoNotAuthorizedResponse(): StrictResponse<HankoUnauthorizedResponse> {
  return HttpResponse.json(
    { code: 401, message: "Unauthorized" },
    { status: 401 },
  );
}

export function getUserByCookies(cookies: Record<string, string | string[]>) {
  const hankoJwt = cookies["hanko"] as string;
  logger.warn("[MSW/Hanko] Retrieving current user by cookies");
  if (!hankoJwt) {
    logger.error("[MSW/Hanko] Cannot parse user from cookies");
    return null;
  }
  const parsedJwt = parseJwt(hankoJwt);
  logger.info(`[MSW/Hanko] Sub: ${parsedJwt.sub}`);
  return findUserById(parsedJwt.sub);
}

export interface HankoCurrentUserResponse {
  id: string;
}
