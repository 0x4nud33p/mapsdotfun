"use client";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "Find",
    },
    {
      text: "the",
    },
    {
      text: "next",
    },
    {
      text: "legit token",
    },
    {
      text: "before it's too late.",
      className: "text-red-400",
    },
  ];
  return (
    <TypewriterEffectSmooth words={words} />
  );
}
