import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOrganizationDetails, updateDomain } from "@/lib/queries";
import { revalidatePath } from "next/cache";
import { SubmitButton } from "./submit-button";

export async function CustomDomainSection() {
  const organizationData = await getOrganizationDetails();

  async function verifyDNS() {
    "use server";

    try {
      const error = await updateDomain(
        organizationData.id,
        organizationData.domain
      );

      if (error) throw new Error("Failed to update domain");

      const change = await fetch(
        `${process.env.NEXT_PUBLIC_SEOFARM_API_URL}/change-domain/${organizationData.id}?new_domain=${organizationData.domain}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!change.ok) throw new Error("Failed to change domain");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SEOFARM_API_URL}/reload-infra`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to reload infrastructure");

      revalidatePath("/settings");
    } catch (error) {
      console.error("Error during DNS refresh:", error);
    }
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>DNS Configuration</CardTitle>
          <CardDescription>Add the below entry in your DNS 👇</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Type</th>
                <th className="text-left">Name</th>
                <th className="text-left">Content</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A</td>
                <td>blog</td>
                <td>3.6.131.149</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <form action={verifyDNS}>
        <div className="flex items-center space-x-2 mt-4">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}

export default CustomDomainSection;
