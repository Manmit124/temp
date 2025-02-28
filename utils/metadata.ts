import { Metadata } from "next";

interface CreateMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  ogImage?: string;
  noIndex?: boolean;
  canonical?: string;
}

export const generateMetadata = ({
  title = 'SEO Farm',
  description = "Optimize your SEO strategy with powerful tools and insights",
  image = "/logo.svg",
  ogImage = "/opengraph-image.png",
  noIndex = false,
  canonical = "",
}: CreateMetadataProps = {}): Metadata => {
  const baseUrl = 'https://app.seofarm.xyz';

  return {
    metadataBase: new URL(baseUrl),
    title: { default: title, template: `%s - SEO Farm` },
    description,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: canonical || baseUrl,
    },
    openGraph: {
      type: "website",
      url: baseUrl,
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    icons: [
      { rel: "icon", sizes: "any", url: image },
      { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
      { rel: "icon", sizes: "32x32", url: "/favicon-32x32.png" },
      { rel: "icon", sizes: "16x16", url: "/favicon-16x16.png" },
    ],
    applicationName: 'SEO Farm',
    referrer: "origin-when-cross-origin",
    keywords: ["SEO", "Blogs", "Impressions", "Clicks", "AI"],
    authors: [{ name: 'SEO Farm', url: baseUrl }],
    creator: 'SEO Farm',
    publisher: 'SEO Farm',
    formatDetection: { email: false, address: false, telephone: false },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
};