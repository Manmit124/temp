import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createOrganization } from "@/lib/queries";
import { User } from "@supabase/supabase-js";
import { SubmitButton } from "./submit-button";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface OrganizationFormProps {
  user: User;
}

const OnboardingForm = ({ user }: OrganizationFormProps) => {
  const onSubmit = async (formData: FormData) => {
    "use server";
    try {
      await createOrganization(formData, user);
    } catch (error) {
      console.error("Error during form submissionn", error);
    }
    revalidatePath("/")
    redirect("/");
  };

  return (
    <form action={onSubmit} className="space-y-6" encType="multipart/form-data">
      <div className="space-y-2">
        <Label htmlFor="name">Organization Name</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="Enter your organization name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain">Domain</Label>
        <Input id="domain" name="domain" required placeholder="example.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Logo</Label>
        <Input type="file" accept="image/*" id="logo" name="logo" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          name="tagline"
          required
          placeholder="Your organization's tagline"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="about">About Company</Label>
        <Textarea
          id="about"
          name="about"
          required
          minLength={500}
          placeholder="Tell us about your organization (minimum 500 characters)"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="authors">Authors</Label>
        <Input
          id="authors"
          name="authors"
          required
          placeholder="John Doe, Jane Smith"
        />
        <p className="text-sm text-muted-foreground">
          Separate multiple authors with commas
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Input
          id="industry"
          name="industry"
          required
          placeholder="Your industry"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="bg_color">Background Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              id="bg_color"
              name="bg_color"
              defaultValue="#FFFFFF"
              className="w-12 h-12 p-1 rounded-md"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme_color">Theme Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              id="theme_color"
              name="theme_color"
              defaultValue="#000000"
              className="w-12 h-12 p-1 rounded-md"
            />
          </div>
        </div>
      </div>

      <SubmitButton />
    </form>
  );
};

export default OnboardingForm;
