import type { Session } from "react-router";
import {
  getApps,
  initializeApp as initializeServerApp,
  cert as serverCert,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getServerEnv } from "~/env.server";

const { FIREBASE_API_KEY, NODE_ENV, SERVICE_ACCOUNT, FIREBASE_APP_NAME } =
  getServerEnv();

const getRestConfig = (): {
  apiKey: string;
  domain: string;
} => {
  if (NODE_ENV === "development" && !FIREBASE_API_KEY) {
    return {
      apiKey: "fake-api-key",
      domain: "http://localhost:9099/identitytoolkit.googleapis.com",
    };
  } else if (!FIREBASE_API_KEY) {
    throw new Error("Missing API_KEY environment variable");
  } else {
    return {
      apiKey: FIREBASE_API_KEY,
      domain: "https://identitytoolkit.googleapis.com",
    };
  }
};

const restConfig = getRestConfig();

const initFirebase = () => {
  let config;
  try {
    config = {
      credential: serverCert(JSON.parse(SERVICE_ACCOUNT)),
    };
  } catch {
    throw Error("Invalid SERVICE_ACCOUNT environment variable");
  }

  if (getApps().length > 0) {
    const allApps = getApps();
    const app = allApps.find((app) => app.name === FIREBASE_APP_NAME);
    return app ? app : initializeServerApp(config, FIREBASE_APP_NAME);
  }
  return initializeServerApp(config, FIREBASE_APP_NAME);
};

const getServerAuth = () => {
  const fireApp = initFirebase();
  return getAuth(fireApp);
};

const serverAuth = getServerAuth();

const getFirebaseUser = async (uid: string) => {
  const user = await serverAuth.getUser(uid);
  return user;
};
// const signInWithPassword = firebaseAuthConfig.signInWithPassword;

interface RestError {
  error: {
    code: number;
    message: string;
    errors: unknown[];
  };
}

const isError = (input: unknown): input is RestError =>
  !!input && typeof input === "object" && "error" in input;

// https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
interface SignInWithPasswordResponse extends Response {
  json(): Promise<
    | RestError
    | {
        /**
         * A Firebase Auth ID token for the authenticated user.
         */
        idToken: string;
        /**
         * The email for the authenticated user.
         */
        email: string;
        /**
         * A Firebase Auth refresh token for the authenticated user.
         */
        refreshToken: string;
        /**
         * The number of seconds in which the ID token expires.
         */
        expiresIn: string;
        /**
         * The uid of the authenticated user.
         */
        localId: string;
        /**
         * Whether the email is for an existing account.
         */
        registered: boolean;
      }
  >;
}

const signInWithPassword = async (
  body: {
    email: string;
    password: string;
    returnSecureToken: true;
  },
  restConfig: {
    apiKey: string;
    domain: string;
  }
) => {
  const response: SignInWithPasswordResponse = await fetch(
    `${restConfig!.domain}/v1/accounts:signInWithPassword?key=${
      restConfig!.apiKey
    }`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  return response.json();
};

const signInWithEmailAndPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const signInResponse = await signInWithPassword(
    {
      email,
      password,
      returnSecureToken: true,
    },
    restConfig
  );

  if (isError(signInResponse)) {
    throw new Error(signInResponse.error.message);
  }

  return signInResponse;
};

const checkSessionCookie = async (session: Session) => {
  try {
    const decodedIdToken = await serverAuth.verifySessionCookie(
      session.get("session") || ""
    );
    return decodedIdToken;
  } catch {
    return { uid: undefined };
  }
};

const signInWithToken = async (idToken: string) => {
  const expiresIn = 1000 * 60 * 60 * 24 * 7; // 1 week
  const sessionCookie = await serverAuth.createSessionCookie(idToken, {
    expiresIn,
  });
  return sessionCookie;
};

export {
  signInWithEmailAndPassword,
  signInWithToken,
  getFirebaseUser,
  checkSessionCookie,
};
