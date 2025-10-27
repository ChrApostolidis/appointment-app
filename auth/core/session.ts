import { userRoles } from "@/drizzle/schema";
import z from "zod";
import { redis } from "@/redis/redis";

// 7 days
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
const COOKIE_SESSION_KEY = "sessionId";

const sessionSchema = z.object({
  id: z.string(),
  role: z.enum(userRoles),
  isProfileComplete: z.string(),
});

type UserSession = z.infer<typeof sessionSchema>;

export type Cookies = {
  set: (
    key: string,
    value: string,
    options: {
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "lax";
      expires?: number;
    }
  ) => void;
  get: (key: string) => { name: string; value: string } | undefined;
  delete: (key: string) => void;
};

function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });
}

export async function createUserSession(
  user: UserSession,
  cookies: Pick<Cookies, "set">
) {
  // Generate a random session ID using Web Crypto API
  const randomBytes = new Uint8Array(64); // 512 bits = 64 bytes
  crypto.getRandomValues(randomBytes);
  const sessionId = Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  
  await redis.set(`session:${sessionId}`, sessionSchema.parse(user), {
    ex: SESSION_EXPIRATION_SECONDS,
  });

  setCookie(sessionId, cookies);
}

export async function getUserFromSession(cookies: Pick<Cookies, "get">) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (!sessionId) return null;

  return getUserSessionById(sessionId);
}

export async function removeUserFromSession(
  cookies: Pick<Cookies, "get" | "delete">
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;

  await redis.del(`session:${sessionId}`);
  cookies.delete(COOKIE_SESSION_KEY);
}


// Used to update session data after user role change
export async function updateUserSessionData(
  user: UserSession,
  cookies: Pick<Cookies, "get">
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
  if (sessionId == null) return null

  await redis.set(`session:${sessionId}`, sessionSchema.parse(user), {
    ex: SESSION_EXPIRATION_SECONDS,
  })
}

// Used to refresh session expiration time on each request user makes
export async function updateUserSessionExpiration(
  cookies: Pick<Cookies, "get" | "set">
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (sessionId == null) return null;
  
  const user = await getUserSessionById(sessionId);
  if (user == null) return;
  
  await redis.set(`session:${sessionId}`, user, {
    ex: SESSION_EXPIRATION_SECONDS,
  });
  setCookie(sessionId, cookies);
}

export async function getUserSessionById(sessionId: string) {
  const rawUser = await redis.get(`session:${sessionId}`);
  if (!rawUser) return null;

  const { success, data: user } = sessionSchema.safeParse(rawUser);

  return success ? user : null;
}
