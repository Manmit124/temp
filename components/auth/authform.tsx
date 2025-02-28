"use client"

import GoogleAuth from "@/components/googleAuth";
import { SubmitButton } from "@/components/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { FormMessage, Message } from "@/components/form-message";
import { useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  formAction: (formData: FormData) => Promise<void>;
}

export default function AuthForm({
  formAction
}: AuthFormProps) {

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getUser();

      if (data?.user) {
        router.push("/");
      }
    }

    checkSession();
  }, [supabase, router]);

  let message: Message | null = null;

  if (searchParams) {
    const successMessageQuery = searchParams.get('success');
    const errorMessageQuery = searchParams.get('error');
    const messageQuery = searchParams.get('message');

    if (successMessageQuery) {
      message = { success: decodeURIComponent(successMessageQuery) };
    } else if (errorMessageQuery) {
      message = { error: decodeURIComponent(errorMessageQuery) };
    } else if (messageQuery) {
      message = { message: decodeURIComponent(messageQuery) };
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full px-4 -mt-20">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-2 text-center px-6 pt-6">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Welcome
          </CardTitle>
          <CardDescription>
            Sign in to continue to SEO Farm
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6">
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <SubmitButton
              className="w-full mt-2"
              pendingText="Signing In..."
              formAction={formAction}
            >
              Sign In
            </SubmitButton>
            <FormMessage message={message} />
            <div className="relative my-4">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-3 text-muted-foreground text-xs">
                  OR
                </span>
              </div>
            </div>
            <GoogleAuth />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}