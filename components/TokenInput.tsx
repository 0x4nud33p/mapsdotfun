"use client";

import { useState } from "react";
import { useTokenStore } from "@/store/token-store";
import { Button } from "@/components/ui/button";
import RecentTokens from "./RecentTokens";

export default function TokenInput() {
  const [input, setInput] = useState("");
  const { fetchTokenData, loading } = useTokenStore();

  const handleScan = () => {
    if (input.trim()) {
      fetchTokenData(input.trim());
    }
  };

  const handleSelectMint = (address: string) => {
    setInput(address);
    fetchTokenData(address);
  };

  return (
    <div className="flex flex-col items-center w-full mt-8">
      <div className="flex gap-3 items-center justify-center w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter Solana Token Mint Address"
          className="border rounded-lg px-4 py-2 w-[60%] text-sm bg-black text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <Button
          disabled={loading}
          onClick={handleScan}
          className="bg-emerald-400 hover:bg-emerald-500 px-4 py-2 rounded-lg text-black"
        >
          {loading ? "Scanning..." : "Scan"}
        </Button>
      </div>

      <RecentTokens onSelect={handleSelectMint} />
    </div>
  );
}
