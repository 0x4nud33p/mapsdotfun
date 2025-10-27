import React from "react";
import Image from "next/image";
import Link from "next/link";
import WalletWrapper from "@/components/WalletWrapper";
import { MovingBorder } from "./ui/moving-border";

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mt-4 rounded-2xl border border-none bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/30">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <Link href="#" className="flex items-center gap-2">
              {/* <Image
                src="/logo.png"
                alt="logo"
                width={20}
                height={20}
                className="hidden sm:block"
              /> */}
              MAPSDOTFUN
            </Link>
            <nav className="hidden items-center gap-8 md:flex">
              <Link
                href="#features"
                className="text-sm text-gray-700"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                className="text-sm text-gray-700"
              >
                About
              </Link>
              <Link href="#" className="text-sm text-gray-700">
                Status
              </Link>
            </nav>
            <div className="hidden md:block">
              <WalletWrapper />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
