import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Blog } from "@/utils/sample-data";
import { generateAndDeployBlog } from "@/lib/queries";
import { SubmitButton } from "./profile/submit-button";
import KnowledgeGraphWrapper from "./home/KnowledgeGraphWrapper";
interface InitialData {
  userDetails: any;
  blogs: Blog[];
  title: string;
  blogDomain: string;
}
export default function Dashboard({ initialData }: { initialData: InitialData }) {
  const { userDetails, blogs, title, blogDomain } = initialData;
  const organizationId = userDetails.organization_id;
  async function clientAction(formData: FormData) {
    'use server';
    
    try {
      const result = await generateAndDeployBlog(formData);
    console.log("result is ",result)
    } catch (error:any) {
      throw new Error('Failed to generate blog',error);
    }
  }
  return (
    <div className="w-full flex flex-col items-center p-5 space-y-8">

    {blogs.length > 0 && (
        <div className="w-full max-w-4xl">
          <KnowledgeGraphWrapper blogs={blogs} />
        </div>
      )}


       <form
        action={clientAction}
        className="flex flex-col items-center space-y-4 w-full max-w-4xl"
      >
        <input type="hidden" name="organizationId" value={organizationId} />
        <input type="hidden" name="blogDomain" value={blogDomain} />
        <div className="flex items-center space-x-4 w-full">
          <textarea
            name="title"
            defaultValue={title}
            placeholder="Enter blog title"
            className="w-full min-h-[100px] p-2 rounded border resize-y"
          />
        </div>
        <SubmitButton/>
      </form>


      {blogs.length > 0 && (
        <div className="w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Blogs</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {blogs.map((blog) => (
                  <li key={blog.id} className="bg-secondary p-4 rounded-lg">
                    <h3 className="text-lg font-semibold">{blog.title}</h3>
                    <p className="text-muted-foreground">by {blog.author}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

