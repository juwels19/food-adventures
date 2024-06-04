import { Crimson_Pro } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { Providers } from "./providers";
import { ourFileRouter } from "./api/uploadthing/core";

import "./globals.css";

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
});

export const metadata = {
  title: "Food Adventures",
  description: "Sabrina and Julian's Food Eating Endeavours",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={crimsonPro.className}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Providers>
          <main className="flex min-h-screen flex-col items-center justify-between p-10 bg-custom-background text-custom-text">
            {children}
          </main>
        </Providers>
        <Toaster richColors position="top-right" expand />
      </body>
    </html>
  );
}
