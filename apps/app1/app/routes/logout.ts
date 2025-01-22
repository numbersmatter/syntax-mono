import { signOut } from "~/services/firebase-auth/auth-funcs.server";
import type { Route } from "./+types/logout";

export async function action({ request }: Route.ActionArgs) {
  return await signOut({ request });
}
