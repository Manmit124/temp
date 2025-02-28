import Link from "next/link";
import SeoFramLogo from "../icon";

import { ArrowUpRight, Settings } from "lucide-react";
import { checkOnboarding, fetchBlogs, fetchBlogDomain } from "@/lib/queries";
import { Blog } from "@/utils/sample-data";
import { createClient } from "@/utils/supabase/server";

// Async server component
export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let blogDomain = null;
  let blogs: Blog[] = [];
  let onboardingCompleted : boolean | undefined = true ;

  if (user) {
    // Fetch organization_id first
    const { data: userData, error: userError } = await supabase
      .from("user_details")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!userError && userData?.organization_id) {
      // Use the existing fetchBlogDomain server action
      blogDomain = await fetchBlogDomain(userData.organization_id);
      blogs = await fetchBlogs(userData.organization_id);
      onboardingCompleted = await checkOnboarding();
    }
  }

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="font-semibold text-lg hover:text-primary transition-colors"
          >
            <div className="flex flex-row items-center">
              <SeoFramLogo className="w-8 h-10" />
              SEO Farm
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <>
              {blogDomain && blogs.length > 0 && (
                <a
                  href={blogDomain}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition-colors cursor-pointer"
                >
                  <ArrowUpRight size={16} className="text-gray-600 group-hover:text-primary transition-colors" />
                  My Blog
                </a>
              )}
              {onboardingCompleted && (
                <Link
                  href="/settings"
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition-colors cursor-pointer"
                >
                  <Settings
                    size={16}
                    className="text-gray-600 group-hover:text-primary transition-colors"
                  />
                  Settings
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}