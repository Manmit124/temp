
import { Textarea } from "@/components/ui/textarea";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchBacklog, getOrganizationDetails, insertBacklog } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { revalidatePath } from "next/cache";
import { SubmitButton } from "./submit-button";

export async function Backlog() {
  const organizationData = await getOrganizationDetails();
  const backlogData = await fetchBacklog(organizationData.id);

  async function submitBacklog(formData: FormData) {
    'use server'

    const info = formData.get('backlog') as string;
    const orgId = formData.get('orgId') as string;

    try {
      await insertBacklog(info, orgId);
      revalidatePath('/settings');
    } catch (error) {
      throw new Error('Failed to update backlog');
    }
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Backlog</CardTitle>
        <CardDescription>Add Additional Information to help generate Articles</CardDescription>
      </CardHeader>
      <form className="p-3"  action={submitBacklog}>
        <Textarea
          id="backlog"
          defaultValue={backlogData?.info || ''}
          className="min-h-[120px]"
        />
        <div className="flex justify-end mt-4">
        <SubmitButton/>
        </div>
      </form>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <div className="p-3">
        <Textarea
          className="min-h-[120px] mb-8"
        />
      </div>
    </Card>
  )
}