import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/navigation/header";
import { Toaster } from "@/components/ui/toaster";
import { generateMetadata } from "@/utils/metadata";
import { ThemeProvider } from "next-themes";
import TawktoChat from "@/components/TawktoChat";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export const metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.className} scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-screen flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex items-center  justify-center container mx-auto px-4 py-8">
              {children}
            </main>
            <Toaster />
            <TawktoChat />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}