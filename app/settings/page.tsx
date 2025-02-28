
import {  checkUser } from "@/lib/queries";
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillingSection } from "@/components/profile/billing-section";
import { PersonalInfo } from "@/components/profile/personal-info";
import { UsageSection } from "@/components/profile/usage-section";
import CustomDomainSection from "@/components/profile/custom-domains";
import { Backlog } from "@/components/profile/backlog";


export default async function Page(){
  const user  = await checkUser();
  if(!user){
    redirect("/login")
  }


  return (
    <div className="container max-w-6xl py-6 space-y-8">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Account</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Your Details</TabsTrigger>
          <TabsTrigger value="domain">Custom Domain</TabsTrigger>
          <TabsTrigger value="backlog">Backlog</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <PersonalInfo />
        </TabsContent>
        <TabsContent value="billing">
          <BillingSection />
        </TabsContent>
        <TabsContent value="usage">
          <UsageSection />
        </TabsContent>
        <TabsContent value="domain">
          <CustomDomainSection />
        </TabsContent>
        <TabsContent value="backlog">
          <Backlog />
        </TabsContent>
      </Tabs>
    </div>
  )
}