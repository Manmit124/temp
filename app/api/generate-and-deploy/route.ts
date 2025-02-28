import { NextRequest, NextResponse } from "next/server";
import { generateAndDeployBlog } from "@/lib/queries";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const { organizationId, title, blogDomain } = await req.json();
    console.log(`API: Starting generate-and-deploy: orgId=${organizationId}, title=${title}`);

    const formData = new FormData();
    formData.append("organizationId", organizationId);
    formData.append("title", title);
    formData.append("blogDomain", blogDomain); // Pass for revalidation

    const result = await generateAndDeployBlog(formData);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API: Error in generate-and-deploy:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Failed to generate and deploy blog" },
      { status: 500 }
    );
  }
}