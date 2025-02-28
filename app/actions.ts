"use server";

import { encodedRedirect } from "../utils/utils";
import { createClient } from "../utils/supabase/server";
import { redirect } from "next/navigation";

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  if (!email) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "Email is required"
    );
  }
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SEOFARM_APP_URL}`,
    },
  })
  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-in", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-in",
      "Thanks for signing up! Please check your email for a sign-in link."
    );
  }
}

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};