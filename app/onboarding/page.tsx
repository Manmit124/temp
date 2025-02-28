
import { checkOnboarding, checkUser } from "@/lib/queries";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OnboardingForm from "@/components/profile/onboardingform";

export default async function Page() {
  const user = await checkUser();
  if (!user) {
    redirect("/login");
  }

  const onboardingStatus = await checkOnboarding();
  if (onboardingStatus) {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Set Up Your Organization</CardTitle>
          <CardDescription>
            Fill in the details below to create your organization profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}