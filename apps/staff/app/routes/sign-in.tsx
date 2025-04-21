import { SignIn } from "@clerk/react-router";
import type { Route } from "./+types/sign-in";
import { getAuth } from "@clerk/react-router/ssr.server";
import { redirect } from "react-router";


export async function loader(args:Route.LoaderArgs) {
    const clerkAuth = await getAuth(args);
    if (clerkAuth.userId) {

    return redirect("/"); // Redirect to home if already signed in
    }

    return null; // Allow the sign-in page to render if not signed in
}



export default function SignInPage() {


    return (
        <SignIn />
    )
}