"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import OrganizationForm from "./organizationForm";
import { useToast } from "@/hooks/use-toast";
import { uploadImage } from "@/utils/supabase/storage/client";
import { ScrollArea } from "../ui/scroll-area";

interface OrganizationFormModalProps {
  open: boolean;
  onClose: () => void;
}

export function OrganizationFormModal({
  open,
  onClose,
}: OrganizationFormModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!open) return;

      setIsInitialLoading(true);
      try {
        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          toast({
            title: "Error",
            description: "You must be logged in to fetch your organization data.",
            variant: "destructive",
          });
          return;
        }

        const { data: userProfile, error: userProfileError } = await supabase
          .from("user_details")
          .select("organization_id")
          .eq("id", user.user.id)
          .single();

        if (userProfileError || !userProfile) {
          toast({
            title: "Error",
            description: "Error fetching user profile.",
            variant: "destructive",
          });
          return;
        }

        setOrganizationId(userProfile.organization_id);

        const { data: organizationData, error: orgError } = await supabase
          .from("organizations")
          .select("name, domain, tagline, about, authors, industry, bg_color, theme_color")
          .eq("id", userProfile.organization_id)
          .single();

        if (orgError) {
          toast({
            title: "Error",
            description: "Error fetching organization data.",
            variant: "destructive",
          });
          return;
        }

        setInitialData(organizationData);
        setIsInitialLoading(false)

      } catch (error: any) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (open) {
      fetchOrganizationData();
    }
  }, [open, toast]);

  const handleSubmit = async (formData: any) => {
    if (!organizationId) return;

    setIsLoading(true);
    try {
      const { logo, ...updateData } = formData;

      const { error: updateError } = await supabase
        .from("organizations")
        .update(updateData)
        .eq("id", organizationId);

      if (updateError) throw updateError;

      if (logo && logo instanceof File) {
        try {
          const { error } = await uploadImage({
            file: logo,
            name: "logo",
            bucket: "Organization",
            folder: formData.domain
          });

          if (error) throw error;
        } catch (uploadError) {
          console.error("Error uploading logo:", uploadError);
          toast({
            title: "Warning",
            description: "Organization updated but logo upload failed.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Success",
        description: "Organization updated successfully!",
      });
      setIsLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update organization.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Organization Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
          <OrganizationForm
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isInitialLoading={isInitialLoading}
            submitButtonText="Save Changes"
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}