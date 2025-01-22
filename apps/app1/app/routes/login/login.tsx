
import { data, Link, redirect } from "react-router";
import { useForm } from "@conform-to/react";
import { Input } from "~/components/ui/input";
import { attemptSignIn } from "./mutations.server";
import { checkAuth } from "~/services/firebase-auth/auth-funcs.server";
import type { Route } from "./+types/login";
/*

*/


export async function loader({ request }: Route.LoaderArgs) {
  const { authenticated } = await checkAuth({ request });

  if (authenticated) {
    return redirect("/");
  }

  return {};
}





export async function action({
  request,
}: Route.ActionArgs) {
  const cookie = request.headers.get("cookie")
  const formData = await request.formData();

  return await attemptSignIn({ cookie, formData });
}



export default function SignInScreen() {

  const [form, fields] = useForm({
    // lastResult: actionData,
    // onValidate({ formData }) {
    //   return parseWithZod(formData, { schema: CreateEventSchema });
    // }
  });

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <Input
                  id={fields.email.id}
                  name={fields.email.name}
                  key={fields.email.key}
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {fields.email.errors &&
                  fields.email.errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-500">
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link to="forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <Input
                  id={fields.password.id}
                  name={fields.password.name}
                  key={fields.password.key}
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {fields.password.errors &&
                  fields.password.errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-500">
                      {error}
                    </p>
                  ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
        <div>
        </div>
      </div>
    </>
  )
}
