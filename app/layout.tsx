import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/query-provider";
import { SolanaProvider } from "@/components/providers/wallet-provider";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mapsdotfun",
  description: "solana map app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.className} ${spaceGrotesk.className}`}
    >
    <QueryProvider>
    <SolanaProvider>
    <TooltipProvider> 
      <body className="font-spaceGrotesk antialiased bg-black text-white">
        {children}
      </body>
      </TooltipProvider>
      </SolanaProvider>
      </QueryProvider>
    </html>
  );
}
