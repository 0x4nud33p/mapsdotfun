"use client";

import dynamic from "next/dynamic";

const WalletConfig = dynamic(() => import("@/components/WalletConfig"), {
  ssr: false,
});

export default function WalletWrapper() {
  return <WalletConfig />;
}
