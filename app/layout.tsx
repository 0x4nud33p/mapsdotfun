import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/query-provider";
import { SolanaProvider } from "@/components/providers/wallet-provider";
import { StoreProvider } from "@/components/providers/token-store-provider";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mapsdotfun - Solana Token Explorer",
  description: "Explore Solana tokens with real-time data and analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={spaceGrotesk.className}>
      <body className="font-spaceGrotesk antialiased bg-black text-white">
        <QueryProvider>
          <SolanaProvider>
            <TooltipProvider>
              <StoreProvider>{children}</StoreProvider>
            </TooltipProvider>
          </SolanaProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
