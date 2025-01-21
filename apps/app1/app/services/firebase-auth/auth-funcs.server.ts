import { type LoaderFunctionArgs, redirect } from "react-router";
import { destroySession, getSession } from "./sessions.server";
import { checkSessionCookie, getFirebaseUser } from "./firebase-auth.server";
import { getServerEnv } from "~/env.server";

const { SIGN_IN_PATH } = getServerEnv();

const checkAuth = async ({ request }: { request: Request }) => {
  // firebase auth setup
  const session = await getSession(request.headers.get("cookie"));
  const { uid } = await checkSessionCookie(session);
  if (!uid) {
    return {
      authenticated: false,
    };
  }
  return { authenticated: true };
};

const requireAuth = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("cookie"));
  const { uid } = await checkSessionCookie(session);
  if (!uid) {
    throw redirect(SIGN_IN_PATH, {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  }

  const user = await getFirebaseUser(uid);

  return {
    uid,
    user,
    authenicated: true,
  };
};

const signOut = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect(SIGN_IN_PATH, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export { checkAuth, requireAuth, signOut };
