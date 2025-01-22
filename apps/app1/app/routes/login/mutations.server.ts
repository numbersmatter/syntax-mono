import { parseWithZod } from "@conform-to/zod";
import { data, redirect } from "react-router";
import { z } from "zod";
import {
  signInWithEmailAndPassword,
  signInWithToken,
} from "~/services/firebase-auth/firebase-auth.server";
import {
  commitSession,
  getSession,
} from "~/services/firebase-auth/sessions.server";

const attemptSignIn = async ({
  cookie,
  formData,
}: {
  cookie: string | null;
  formData: FormData;
}) => {
  let sessionCookie;
  const idToken = formData.get("idToken");
  try {
    if (typeof idToken === "string") {
      sessionCookie = await signInWithToken(idToken);
    } else {
      const submission = parseWithZod(formData, {
        schema: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
      });
      if (submission.status !== "success") {
        return data(submission.reply(), { status: 400 });
      }
      const { idToken } = await signInWithEmailAndPassword({
        email: submission.value.email,
        password: submission.value.password,
      });
      sessionCookie = await signInWithToken(idToken);
    }

    const session = await getSession(cookie);
    session.set("session", sessionCookie);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    return data({ error: String(error) }, { status: 401 });
  }
};
export { attemptSignIn };
