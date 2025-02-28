import { signInAction } from "@/app/actions";
import AuthForm from "@/components/auth/authform";
import { Suspense } from "react";
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function SignIn() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/')
  }
  return (
    <Suspense>
      <AuthForm formAction={signInAction} />
    </Suspense>
  );
}