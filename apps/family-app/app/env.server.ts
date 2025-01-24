import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  FIREBASE_API_KEY: z.string().min(1),
  COOKIE_SECRET: z.string().min(1),
  SERVICE_ACCOUNT: z.string().min(1),
  FIREBASE_APP_NAME: z.string().default("default"),
  CLERK_PUBLISHABLE_KEY: z.string().min(1),
  SIGN_IN_PATH: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(5),
});

export const initEnvVariables = () => {
  const env = envSchema.safeParse(process.env);
  if (!env.success) {
    console.error(
      "Invalid environment variables",
      env.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }
  return env.data;
};

export const getServerEnv = () => initEnvVariables();

// manunally add client env variables
export const getClientEnv = () => {
  const serverEnv = getServerEnv();

  return {};
};

export type CLIENT_ENV = ReturnType<typeof getClientEnv>;
type APP_ENV = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends APP_ENV {}
  }
}
