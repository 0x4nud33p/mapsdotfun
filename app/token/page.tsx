"use client";

import TokenInput from "@/components/TokenInput";
import TokenScanner from "@/components/TokenScanner";
import { useTokenStore } from "@/store/token-store";

export default function Page() {
  const { tokenData, loading, error } = useTokenStore();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6">
      <TokenInput />

      {loading && (
        <p className="mt-6 text-indigo-400 animate-pulse">
          Fetching token data from Solana...
        </p>
      )}
      {error && <p className="mt-6 text-red-500">{error}</p>}

      {!loading && tokenData && (
        <div className="w-full mt-10">
          <TokenScanner
            tokenMetadata={{
              name: tokenData.name,
              symbol: tokenData.symbol,
              address: tokenData.address,
              totalSupply: tokenData.totalSupply,
              liquidityPool: "N/A",
              top_100_holders: tokenData.top_100_holders,
              logoURI: tokenData.logoURI,
              decimals: tokenData.decimals,
              // mock data currently
              risk: {
                centralization: "low",
                liquidity: "moderate",
                transfers: "normal",
              },
            }}
          />
        </div>
      )}
    </main>
  );
}
