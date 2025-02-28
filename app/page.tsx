import Dashboard from '@/components/dashboard'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers';
import { checkOnboarding, fetchBlogDomain, fetchBlogs, generateTitle, getUserData } from '@/lib/queries';

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const headersList = await headers();
  const pathname = headersList.get('x-nextjs-route');
  console.log(pathname)
  if (!user) {
    if (pathname !== '/sign-in' && pathname !== '/forgot-password') {
      redirect('/sign-in');
    }
  }
  const onboardingStatus = await checkOnboarding();

  if (!onboardingStatus) {
    redirect('/onboarding');
  }

  const userDetails = await getUserData();
  console.log(userDetails)
  const initialBlogs = await fetchBlogs(userDetails.organization_id);
  const initialTitle = await generateTitle(userDetails.organization_id);
  const initialBlogDomain = await fetchBlogDomain(userDetails.organization_id);

  console.log("intials title is",initialTitle)
  console.log("intials blog is",initialBlogs)
  console.log("intials blogDomain is",initialBlogDomain)

  return <Dashboard
  initialData={{
    userDetails,
    blogs:initialBlogs,
    title:initialTitle?.[0] ?? '',
    blogDomain:initialBlogDomain[0]
  }}
  />
}