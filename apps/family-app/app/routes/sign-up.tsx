import { SignUp } from "@clerk/react-router"


export default function Login() {

  return (
    <div className="grid min-h-screen w-full">
      <div className="flex flex-col place-content-center">
        <div className="mx-auto">
          <img
            src="https://static.showit.co/400/Z5tHYwifQaCauHDR4UCljA/shared/cis_thomasville_horizontal_web.png"
            alt="logo"
            className="h-36 object-contain"
          />
        </div>

        <main className="flex flex-1 flex-col content-center items-center  gap-4 p-4 lg:gap-6 lg:p-6">
          {/* <h1 className="text-3xl font-bold">
            Returning Users Sign In
          </h1>
          <p>
            If you need to register click <Link to="/sign-up">
              <span className="text-blue-600 underline hover:text-blue-800">
                here
              </span>
            </Link>
          </p> */}
          <SignUp
            appearance={{
              elements: {
                "cl-logoBox": "h-34"
              }
            }

            }
          />

          {/* <pre>{JSON.stringify(authTry, null, 2)}</pre> */}
        </main>
      </div>
    </div>
  )
}