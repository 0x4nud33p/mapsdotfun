"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { TypewriterEffectSmoothDemo } from "./Typewriter";

const memeCoins = [
  // { src: "/icons/doge.png", alt: "Dogecoin", angle: 0, distance: 190 },
  { src: "/icons/shib.png", alt: "Shiba Inu", angle: 30, distance: 160 },
  { src: "/icons/pepe.png", alt: "Pepe", angle: 60, distance: 210 },
  { src: "/icons/bonk.png", alt: "Bonk", angle: 90, distance: 190 },
  { src: "/icons/floki.png", alt: "Floki", angle: 120, distance: 240 },
  { src: "/icons/turbo.png", alt: "Turbo", angle: 150, distance: 180 },
  // { src: "/icons/babedoge.png", alt: "Baby Doge", angle: 180, distance: 200 },
  { src: "/icons/kishu.png", alt: "Kishu Inu", angle: 210, distance: 160 },
  { src: "/icons/akita.png", alt: "Akita Inu", angle: 240, distance: 170 },
  { src: "/icons/wojak.png", alt: "Wojak", angle: 270, distance: 220 },
  { src: "/icons/book.png", alt: "Book of Meme", angle: 300, distance: 180 },
  { src: "/icons/milady.png", alt: "Milady", angle: 330, distance: 170 },
  { src: "/icons/image1.png", alt: "Dogecoin1", angle: 10, distance: 300 },
  { src: "/icons/image2.webp", alt: "Shiba Inu1", angle: 30, distance: 300 },
  { src: "/icons/image3.png", alt: "Pepe1", angle: 60, distance: 300 },
  { src: "/icons/image4.png", alt: "Bonk1", angle: 90, distance: 300 },
  { src: "/icons/image5.png", alt: "Floki1", angle: 120, distance: 300 },
  { src: "/icons/image6.png", alt: "Turbo1", angle: 150, distance: 300 },
  { src: "/icons/image7.png", alt: "Baby Doge1", angle: 180, distance: 300 },
  { src: "/icons/image8.png", alt: "Kishu Inu1", angle: 210, distance: 300 },
  { src: "/icons/image10.png", alt: "Akita Inu1", angle: 230, distance: 300 },
  { src: "/icons/image11.png", alt: "Wojak1", angle: 260, distance: 300 },
  { src: "/icons/image12.jpeg", alt: "Book of Meme1", angle: 290, distance: 300 },
  { src: "/icons/image13.png", alt: "Milady1", angle: 320, distance: 300 },
  { src: "/icons/image14.png", alt: "Milady13", angle: 345, distance: 300 },
];

type RadarProps = {
  className?: string;
  heading: string;
  subHeading: string;
};

export const Radar = ({ className, heading, subHeading }: RadarProps) => {
  const circles = new Array(8).fill(1);
  const [rotation, setRotation] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let frame: number;
    const animate = () => {
      setRotation((r) => (r + 0.3) % 360);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={twMerge(
        "relative flex h-[500px] w-[500px] items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.05)_0%,transparent_70%)]",
        className
      )}
    >
      {/* Center text */}
      {(heading || subHeading) && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center">
          {heading && (
            <h1 className="text-white text-4xl font-bold leading-tight mb-[-20px]">
              {heading}
            </h1>
          )}
          {subHeading && <TypewriterEffectSmoothDemo />}
        </div>
      )}

      {/* Radar sweeping spotlight */}
      <motion.div
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center",
        }}
        className="absolute inset-[-134px] rounded-full z-30"
      >
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(45,212,191,0.25)_0deg,rgba(45,212,191,0.05)_20deg,transparent_60deg)]" />
      </motion.div>

      {/* Concentric radar rings */}
      {circles.map((_, idx) => (
        <Circle
          key={idx}
          style={{
            height: `${(idx + 1) * 6}rem`,
            width: `${(idx + 1) * 6}rem`,
            border: `1px solid rgba(71, 85, 105, ${1 - (idx + 1) * 0.1})`,
          }}
          idx={idx}
        />
      ))}

      {/* Meme coins */}
      {memeCoins.map((coin) => {
        const diff = Math.abs(rotation - coin.angle);
        const distance = Math.min(diff, 360 - diff);
        const intensity = Math.max(0, 1 - distance / 30);

        return (
          <div
            key={coin.alt}
            style={{
              position: "absolute",
              transform: `rotate(${coin.angle}deg) translate(${coin.distance}px) rotate(-${coin.angle}deg)`,
            }}
          >
            <Image
              src={coin.src}
              alt={coin.alt}
              width={45}
              height={45}
              style={{
                filter: `drop-shadow(0 0 ${
                  10 * intensity
                }px rgba(56,189,248,${intensity}))`,
                opacity: 0.4 + 0.6 * intensity,
                transform: `scale(${1 + 0.25 * intensity})`,
                transition: "all 0.3s linear",
              }}
              className="rounded-full hover:cursor-pointer"
            />
          </div>
        );
      })}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Circle = ({ className, idx, ...rest }: any) => (
  <motion.div
    {...rest}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{
      delay: idx * 0.1,
      duration: 0.2,
    }}
    className={twMerge(
      "absolute inset-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-neutral-800",
      className
    )}
  />
);
