import type { LoaderFunctionArgs } from "react-router";
import { getClerkAuth } from "./clerk-auth.server";

export const requireAuth = async (args: LoaderFunctionArgs) => {
  const { userId} = await getClerkAuth(args);

  if (!userId){
    
  }




}