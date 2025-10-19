"use client";

import { memo } from "react";
import { Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "@/components/providers/wallet-provider";

const WalletConfig = () => {
  const { connected } = useWallet();

  return (
    <div>
      {connected ? (
        <WalletButton className="font-semibold px-6 py-2 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl" />
      ) : (
        <WalletButton className="font-semibold px-6 py-2 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </WalletButton>
      )}
    </div>
  );
};

export default memo(WalletConfig);