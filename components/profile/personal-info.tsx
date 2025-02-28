
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut } from "lucide-react";
import { getOrganizationDetails } from "@/lib/queries"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


const signOutAction = async () => {
  "use server"
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export async function PersonalInfo() {

  const orgData = await getOrganizationDetails();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>Organization Details</CardTitle>
            <CardDescription>Manage your organization information and preferences</CardDescription>
          </div>
          <Button disabled={true}  variant="outline">
            Edit Details
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Name</div>
              <div className="text-sm">{orgData?.name || "Not set"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Domain</div>
              <div className="text-sm">{orgData?.domain || "Not set"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Industry</div>
              <div className="text-sm">{orgData?.industry || "Not set"}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Authors</div>
              <div className="text-sm">{orgData?.authors || "Not set"}</div>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">About</div>
            <div className="text-sm mt-1">{orgData?.about || "No description provided"}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Background Color</div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border" style={{ backgroundColor: orgData?.bg_color }} />
                <span className="text-sm">{orgData?.bg_color}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Theme Color</div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border" style={{ backgroundColor: orgData?.theme_color }} />
                <span className="text-sm">{orgData?.theme_color}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div>
        <form action={signOutAction}>
        <Button

          type="submit"
          variant="destructive"
          className="text-red-600  text-white border-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>

        </form>
      </div>
    </div>
  )
}

