import React from "react";
import { Button } from "./ui/button";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import FooterGradient from "./ui/footer-gradient";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer className="h-[30rem] md:h-[40rem] relative py-10 mt-20">
        <div className="bg-black z-[-1] opacity-95 absolute inset-0 bg-dot-white"></div>
        <FooterGradient />
        <div className="flex z-[20] flex-col items-center justify-between h-full">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl text-center font-medium">
              token transparency platform in the
              <span className="text-muted-foreground/40 text-3xl md:text-5xl">
                <br />
                <span className="bg-gradient-to-tr mx-2 from-white via-emerald-400 to-white bg-clip-text text-transparent">
                  Solana ecosystem.
                </span>
              </span>
            </h1>
            <p className="text-muted-foreground mt-4 text-center max-w-2xl">
              No more getting rugged. No more insider advantages. Just pure,
              transparent data.
            </p>
            <div className="mt-8">
              <Link href="/token" className="inline-block">
                <Button className="bg-emerald-400 text-black hover:bg-emerald-400/90 hover:cursor-pointer">
                  Try Now
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex border-border/40 pt-8 w-full">
            <div className="max-w-6xl mx-auto px-4 w-full flex items-center justify-between">
              <div className="text-sm md:text-base">
                &copy;{new Date().getFullYear()} Mapsdotfun
              </div>
              <div className="flex gap-4 items-center justify-center">
                <Link
                  href="https://github.com/0x4nud33p/mapsdotfun"
                  target="_blank"
                  className=""
                >
                  <IconBrandGithub className="size-5 md:size-8" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/0x4nud33p/"
                  target="_blank"
                  className=""
                >
                  <IconBrandLinkedin className="size-5 md:size-8" />
                </Link>
                <Link
                  href="https://x.com/0x4nud33p"
                  target="_blank"
                  className=""
                >
                  <IconBrandX className="size-5 md:size-8" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
