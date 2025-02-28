"use server"
import { createClient } from "@/utils/supabase/server"
import { User } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function checkUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
export async function getUserDatawitId(userId: string | null) {
  const supabase = await createClient();
  const { data: userData, error } = await supabase
    .from('user_details')
    .select('*')
    .eq('id', userId)
    .single()

  return userData;
}
export async function getUserData() {
  const supabase = await createClient();
  const user = await checkUser();
  if (!user) {
    console.log('NO USER', user);
    return null;
  }

  const { data: userData, error } = await supabase
    .from('user_details')
    .select('*')
    .eq('id', user.id)
    .single()
  return userData
}

export async function fetchBlogs(organizationId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('blogs')
    .select('id, title, author, keywords')
    .eq('organization_id', organizationId)

  if (error) throw new Error(`Failed to fetch blogs: ${error.message}`)

  console.log("these are blogs for organizationId: ", organizationId, data)

  // revalidatePath('/')
  return data || []
}

export async function getOrganizationDetails() {
  const supabase = await createClient()

  const userData = await getUserData();

  const { data: orgData, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', userData.organization_id)
    .single()

  if (orgError) throw new Error(`Failed to fetch organization: ${orgError.message}`)

  return orgData
}

export async function updateDomain(organization_id: string, domain: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("infra")
    .update({ blog_domain: `blog.${domain}` })
    .eq("organization_id", organization_id)
  return error
}

export async function fetchBacklog(organization_id: string) {
  const supabase = await createClient()
  const { data: info }: { data: any } = await supabase
    .from("backlog")
    .select('info')
    .eq('organization_id', organization_id)
    .single();

  if (!info) {
    console.log('No data found for this organization');
    return null;
  }
  return info;
}

export async function insertBacklog(info: string, organization_id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("backlog")
    .upsert(
      { info, organization_id },
      { onConflict: 'organization_id' }
    );

  return error
}

const provisionInfra = async (orgId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SEOFARM_API_URL}/infra/${orgId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok)
      throw new Error("Failed to provision infrastructure");
  } catch (error) {
    console.error("Error provisioning infra:", error);
    throw error;
  }
};


export async function onboardUser(orgId: string) {
  const supabase = await createClient();
  const user = await checkUser();
  if (!user) {
    throw new Error("User is not authenticated");
  }
  try {
    await Promise.all([provisionInfra(orgId), supabase
      .from("user_details")
      .upsert([
        {
          id: user.id,
          has_onboarded: true,
          organization_id: orgId,
        },
      ])
    ])
  } catch (error) {
    await supabase
      .from("user_details")
      .upsert([
        {
          id: user.id,
          has_onboarded: false,
        },
      ])
    console.log(error)
    throw error
  }
}

export async function fetchBlogDomain(orgId: string) {
  try {
    const supabase = await createClient();
    const { data: infraData, error: infraError } = await supabase
      .from("infra")
      .select("blog_domain")
      .eq("organization_id", orgId)
      .single();

    if (infraError) throw infraError;

    if (infraData?.blog_domain) {
      const BlogDomain = `https://${infraData.blog_domain}`;
      return BlogDomain;
    } else {
      return "";
    }
  } catch (error) {
    console.error("Error fetching Blog Domain:", error);
    return "";
  }
}

export async function checkOnboarding() {
  const supabase = await createClient();
  const user = await checkUser();
  if (user) {
    const { data: userDetails, error: userDetailsError } = await supabase
      .from("user_details")
      .select("has_onboarded")
      .eq("id", user.id)
      .single();

    if (!userDetailsError && !userDetails?.has_onboarded) {
      return false;
    }
    else if (!userDetailsError && userDetails?.has_onboarded) {
      return true;
    }
  }
}


export async function createOrganization(formData: FormData, user: User) {

  try {
    const supabase = await createClient();

    const organizationData = {
      name: formData.get('name') as string,
      domain: formData.get('domain') as string,
      tagline: formData.get('tagline') as string,
      about: formData.get('about') as string,
      authors: formData.get('authors') as string,
      industry: formData.get('industry') as string,
      bg_color: formData.get('bg_color') as string || '#FFFFFF',
      theme_color: formData.get('theme_color') as string || '#000000',
    };

    // Handle logo upload
    const logo = formData.get('logo') as File;
    let logo_ext = null;

    if (logo && logo.name) {
      logo_ext = logo.name.split('.').pop();
    }

    // Create organization
    const { data: organizationDataResponse, error: organizationError } = await supabase
      .from('organizations')
      .upsert([{ ...organizationData, logo_ext }])
      .select("id, name, domain, tagline, about, authors, industry, bg_color, theme_color, logo_ext")
      .single();

    if (organizationError) throw new Error(organizationError.message);


    if (logo && organizationDataResponse) {
      // Implement server-side file upload logic here
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('Organization')
        .upload(`${organizationData.domain}/logo`, logo);

      if (storageError) throw storageError;
    }


    const keywordsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SEOFARM_API_URL}/keywords-with-hero-image?details=${organizationDataResponse.about}&name=${organizationDataResponse.name}&industry=${organizationDataResponse.industry}&domain=${organizationDataResponse.domain}&organization_id=${organizationDataResponse.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!keywordsResponse.ok) {
      throw new Error("Failed to add hero image and keywords");
    }

    const infraResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SEOFARM_API_URL}/infra/${organizationDataResponse.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    if (!infraResponse.ok) {
      throw new Error("Failed to provision infrastructure");
    }


    const { error: userError } = await supabase
      .from('user_details')
      .upsert([
        {
          id: user?.id,
          has_onboarded: true,
          organization_id: organizationDataResponse.id
        }
      ]);

    if (userError) throw userError;



  } catch (error: any) {
    console.error('Error creating organization:', error);
    throw new Error(error.message);
  }
}

export const generateTitle = async (orgId: string): Promise<string[]> => {
  console.log("generating title");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SEOFARM_API_URL}/title/${orgId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("response is", response);
    if (!response.ok) throw new Error("Failed to generate title");

    const data = await response.json();
    console.log("parsed data:", data);
    return Array.isArray(data) ? data : [data];
  } catch (error: any) {
    console.error("Error generating title:", error.message);
    return [""];
  }
};

async function delayedFunctionCall(
  initialWaitTime: number,
  intervalTime: number,
  callback: () => Promise<boolean>
): Promise<boolean> {
  console.log(`Starting delayedFunctionCall: initialWaitTime=${initialWaitTime}s, intervalTime=${intervalTime}s`);
  await new Promise((resolve) => setTimeout(resolve, initialWaitTime * 1000));
  console.log("Initial wait completed, starting polling");

  let iteration = 0;
  while (true) {
    iteration++;
    console.log(`Polling iteration ${iteration}`);
    const stop = await callback();
    console.log(`Callback returned: stop=${stop}`);
    if (stop) {
      console.log("Polling completed successfully");
      return true;
    }
    console.log(`Waiting ${intervalTime}s before next poll`);
    await new Promise((resolve) => setTimeout(resolve, intervalTime * 1000));
  }
}


async function checkStatus(taskId: string): Promise<string> {
  console.log(`Checking status for taskId: ${taskId}`);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SEOFARM_API_URL}/task-status/${taskId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log(`Status check response: status=${response.status}, ok=${response.ok}`);
    if (!response.ok) throw new Error("Failed to check status");
    const data = await response.json();
    console.log(`Status check result: ${data.status}`);
    return data.status;
  } catch (error) {
    console.error("Error checking status:", error);
    return "FAILED";
  }
}

// Server action for generating and deploying blogs
export async function generateAndDeployBlog(formData: FormData) {

  const organizationId = formData.get("organizationId") as string;
  const title = formData.get("title") as string;
  const blogDomain = formData.get("blogDomain") as string || "/";

  console.log(`Starting generateAndDeployBlog: orgId=${organizationId}, title=${title}`);

  try {
    // Generate blog
    console.log("Fetching blog generation API");
    const generateResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SEOFARM_API_URL}/blogs/${organizationId}?blog_title=${encodeURIComponent(title)}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );
    console.log(`Generate response: status=${generateResponse.status}, ok=${generateResponse.ok}`);
    if (!generateResponse.ok) {
      throw new Error(`Failed to generate blog: ${generateResponse.statusText}`);
    }
    const generateData = await generateResponse.json();
    console.log(`Generate data: ${JSON.stringify(generateData)}`);

    // Poll for generation status
    console.log("Starting polling for blog generation status");
    const generationSuccess = await delayedFunctionCall(30, 2, async () => {
      const status = await checkStatus(generateData.task_id);
      console.log(`Generation status: ${status}`);
      if (status === "SUCCESS") return true;
      if (status === "FAILED") throw new Error("Blog generation failed");
      return false;
    });
    console.log(`Generation polling result: ${generationSuccess}`);

    if (!generationSuccess) {
      throw new Error("Blog generation did not complete successfully");
    }

    // Deploy blogs
    console.log("Fetching blog deployment API");
    const deployResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SEOFARM_API_URL}/deploy/${organizationId}`,
      { method: "GET", headers: { "Content-Type": "application/json" } }
    );
    console.log(`Deploy response: status=${deployResponse.status}, ok=${deployResponse.ok}`);
    if (!deployResponse.ok) {
      throw new Error(`Failed to deploy blogs: ${deployResponse.statusText}`);
    }
    const deployData = await deployResponse.json();
    console.log(`Deploy data: ${JSON.stringify(deployData)}`);

    // Poll for deployment status
    console.log("Starting polling for blog deployment status");
    const deploySuccess = await delayedFunctionCall(105, 3, async () => {
      const status = await checkStatus(deployData.task_id);
      console.log(`Deployment status: ${status}`);
      if (status === "SUCCESS") return true;
      if (status === "FAILED") throw new Error("Blog deployment failed");
      return false;
    });
    console.log(`Deployment polling result: ${deploySuccess}`);

    if (!deploySuccess) {
      throw new Error("Blog deployment did not complete successfully");
    }

    // Refresh data and redirect
    console.log("Revalidating path and redirecting to /");
    revalidatePath("/"); // Dashboard
    revalidatePath(blogDomain);
    return { success: true, blogDomain }; // Return to client
  } catch (error: any) {
    console.error("Error in generateAndDeployBlog:", error.message || error);
    throw error; // Propagate to BlogForm.tsx for client-side handling
  }


}

export async function getUserEmail() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email;
}

export async function insertSubscriptionDetails(subscriptionId: string, customer_id: string, plan: string, billingCycle: string, status: string, trialPeriod: boolean) {
  try {
    const supabase = await createClient();
    const { data: subscriptionData, error: subsError } = await supabase
      .from("subscription")
      .upsert([{
        "id": subscriptionId,
        "customer_id": customer_id,
        "plan_type": plan,
        "billing_cycle": billingCycle,
        status,
        "trial_period": trialPeriod
      }])
      .select("*")
      .single();
    console.log(subscriptionData, "subscriptionData")
    if (subsError) throw subsError;
  } catch (error) {
    console.error("Error upserting Subscription Data:", error);
  }
}

export async function updateSubscriptionDetails(subscriptionId: string, customer_id: string, plan: string, billingCycle: string, status: string, trialPeriod: boolean) {
  try {
    const supabase = await createClient();
    const { data: subscriptionData, error: subsError } = await supabase
      .from("subscription")
      .upsert([{
        "id": subscriptionId,
        "customer_id": customer_id,
        "plan_type": plan,
        "billing_cycle": billingCycle,
        status,
        "trial_period": trialPeriod
      }])
      .select("*")
      .single();
    console.log(subscriptionData, "subscriptionData")
    if (subsError) throw subsError;
  } catch (error) {
    console.error("Error upserting Subscription Data:", error);
  }
}

export async function addCustomerId(customerId: string, orgId: string) {
  try {
    const supabase = await createClient();
    const { data: customerData, error: customerError } = await supabase
      .from("organizations")
      .update([{
        "customer_id": customerId
      }])
      .eq("id", orgId)
      .select("id, customer_id")
      .single();
    console.log(customerData, "customerData")

    if (customerError) throw customerError;
  } catch (error) {
    console.error("Error updating Customer Id:", error);
  }
}