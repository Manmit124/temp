"use client";
import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface BlogFormProps {
  organizationId: string;
  initialTitle: string;
  blogDomain: string;
}

export default function BlogForm({ organizationId, initialTitle, blogDomain }: BlogFormProps) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(initialTitle);
  const { toast } = useToast();
  const router=useRouter();
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        console.log(`Calling API: orgId=${organizationId}, title=${title}`);
        const response = await fetch("/api/generate-and-deploy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organizationId, title, blogDomain }),
        });

        const data = await response.json();
        console.log("API response:", data);

        if (!response.ok || data.error) {
          throw new Error(data.error || "Failed to generate and deploy blog");
        }

        toast({
          title: "Success",
          description: "Blog generated and deployed successfully!",
        });
        router.push(blogDomain || "/");
      } catch (error: any) {
        console.error("BlogForm error:", error.message || error);
        toast({
          title: "Error",
          description: error.message || "Failed to generate or deploy blog.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <form
        onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-4 w-full max-w-4xl"
    >
      <input type="hidden" name="organizationId" value={organizationId} />
      <div className="flex items-center space-x-4 w-full">
        <Textarea
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title"
          className="flex-grow"
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Blog"
        )}
      </Button>
    </form>
  );
}