import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingCard from "@/components/billing/pricingCard";

export default function PricingPage() {
  const pricingData = {
    monthly: {
      standard: { price: "$50", priceId: process.env.STANDARD_MONTHLY_PRICE_ID },
      pro: { price: "$150", priceId: process.env.PRO_MONTHLY_PRICE_ID },
      custom: "$*.00",
    },
    annual: {
      standard: { price: "$500", priceId: process.env.STANDARD_ANNUAL_PRICE_ID },
      pro: { price: "$1500", priceId: process.env.PRO_ANNUAL_PRICE_ID },
      custom: "$*.00",
    },
  };

  const features = {
    monthly: {
      standard: [
        "Blog page",
        "5 Specialized well-researched blogs",
        "10 location-based blogs",
        "24/7 customer support",
        "Automatic Blog Posting",
        "Custom Domain Name Integration",
      ],
      pro: [
        "Blog Page",
        "25 Specialized well-researched blogs",
        "35 location-based blogs",
        "24/7 customer support",
        "Automatic Blog Posting",
        "Custom Domain Name Integration",
      ],
      custom: [
        "Blog Page",
        "* Specialized well-researched blogs",
        "* location-based blogs",
        "24/7 customer support",
        "Automatic Blog Posting",
        "Custom Domain Name Integration",
      ],
    },
    annual: {
      standard: [
        "Blog page",
        "60 Specialized well-researched blogs",
        "120 location-based blogs",
        "Priority 24/7 customer support",
        "Automatic Blog Posting",
        "Custom Domain Name Integration",
      ],
      pro: [
        "Blog Page",
        "300 Specialized well-researched blogs",
        "420 location-based blogs",
        "Priority 24/7 customer support",
        "Automatic Blog Posting",
        "Custom Domain Name Integration",
      ],
      custom: [
        "Blog Page",
        "* Specialized well-researched blogs",
        "* location-based blogs",
        "Premium 24/7 customer support",
        "Automatic Blog Posting",
        "Custom Domain Name Integration",
      ],
    },
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-semibold text-center mb-5">Plans and Pricing</h1>
      <h3 className=" text-muted-foreground text-center mb-8">Start Today, Scale with Us Tomorrow</h3>
      <Tabs defaultValue="annual" className="space-y-8">
        <TabsList className="flex justify-center gap-8 bg-white">
          <TabsTrigger
            value="monthly"
            className="text-lg font-medium border-2 py-2 px-4 rounded-lg hover:bg-gray-200 focus:bg-black focus:text-white data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
          >
            Monthly
          </TabsTrigger>
          <TabsTrigger value="annual" className="text-lg font-medium border-2 py-2 px-4 rounded-lg hover:bg-gray-200 focus:bg-black focus:text-white data-[state=active]:bg-black data-[state=active]:text-white transition-colors"
          >
            Annual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PricingCard
              title="Standard"
              price={pricingData.monthly.standard.price}
              description="For passive SEO building"
              features={features.monthly.standard}
              priceId={pricingData.monthly.standard.priceId}
            />

            <PricingCard
              title="Pro"
              price={pricingData.monthly.pro.price}
              description="For aggressive active SEO building"
              features={features.monthly.pro}
              isPopular={true}
              priceId={pricingData.monthly.pro.priceId}
            />

            <PricingCard
              title="Custom"
              price={pricingData.monthly.custom}
              description="For custom SEO building"
              features={features.monthly.custom}
            />
          </div>
        </TabsContent>

        <TabsContent value="annual">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PricingCard
              title="Standard"
              price={pricingData.annual.standard.price}
              description="For passive SEO building"
              features={features.annual.standard}
              priceId={pricingData.annual.standard.priceId}
            />

            <PricingCard
              title="Pro"
              price={pricingData.annual.pro.price}
              description="For aggressive active SEO building"
              features={features.annual.pro}
              isPopular={true}
              priceId={pricingData.annual.pro.priceId}
            />

            <PricingCard
              title="Custom"
              price={pricingData.annual.custom}
              description="For custom SEO building"
              features={features.annual.custom}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
