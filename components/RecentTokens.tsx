"use client";

import { useTokenStore } from "@/store/token-store";
import { Button } from "@/components/ui/button";

const suggestedMints = [
  { name: "USDC", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
  { name: "BONK", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" },
  {
    name: "SOL (Wrapped)",
    address: "So11111111111111111111111111111111111111112",
  },
  { name: "mSOL", address: "mSoLzYCxHdYgK4bsr7YcT8dPzYxVQpo1CNWun7fGsr8" },
];

export default function RecentTokens({
  onSelect,
}: {
  onSelect: (addr: string) => void;
}) {
  const { loading } = useTokenStore();

  return (
    <div className="mt-6 w-full flex flex-wrap justify-center gap-2">
      {suggestedMints.map((token) => (
        <Button
          key={token.address}
          onClick={() => onSelect(token.address)}
          disabled={loading}
          className="bg-emerald-400 hover:bg-emerald-500 text-black px-3 py-1 text-sm rounded-lg cursor-pointer"
        >
          {token.name}
        </Button>
      ))}
    </div>
  );
}
