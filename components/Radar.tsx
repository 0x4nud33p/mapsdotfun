"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";

const memeCoins = [
  { src: "/icons/doge.png", alt: "Dogecoin", angle: 0, distance: 180 },
  { src: "/icons/shib.png", alt: "Shiba Inu", angle: 30, distance: 150 },
  { src: "/icons/pepe.png", alt: "Pepe", angle: 60, distance: 200 },
  { src: "/icons/bonk.png", alt: "Bonk", angle: 90, distance: 170 },
  { src: "/icons/floki.png", alt: "Floki", angle: 120, distance: 210 },
  { src: "/icons/turbo.png", alt: "Turbo", angle: 150, distance: 160 },
  { src: "/icons/babedoge.png", alt: "Baby Doge", angle: 180, distance: 190 },
  { src: "/icons/kishu.png", alt: "Kishu Inu", angle: 210, distance: 140 },
  { src: "/icons/akita.png", alt: "Akita Inu", angle: 240, distance: 170 },
  { src: "/icons/wojak.png", alt: "Wojak", angle: 270, distance: 200 },
  { src: "/icons/book.png", alt: "Book of Meme", angle: 300, distance: 160 },
  { src: "/icons/milady.png", alt: "Milady", angle: 330, distance: 190 },
];

export const Radar = ({ className }: any) => {
  const circles = new Array(8).fill(1);
  const [rotation, setRotation] = useState(0);

  // Animate continuous rotation
  useEffect(() => {
    let frame: number;
    const animate = () => {
      setRotation((r) => (r + 0.2) % 360); // adjust speed here
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
      {/* Radar sweeping spotlight */}
      <motion.div
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center",
        }}
        className="absolute inset-0 rounded-full z-30"
      >
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,rgba(56,189,248,0.25)_0deg,rgba(56,189,248,0.05)_20deg,transparent_60deg)]" />
      </motion.div>

      {/* Concentric radar rings */}
      {circles.map((_, idx) => (
        <Circle
          key={idx}
          style={{
            height: `${(idx + 1) * 5}rem`,
            width: `${(idx + 1) * 5}rem`,
            border: `1px solid rgba(71, 85, 105, ${1 - (idx + 1) * 0.1})`,
          }}
          idx={idx}
        />
      ))}

      {/* Meme coins */}
      {memeCoins.map((coin) => {
        // Smooth highlight based on radar angle
        const diff = Math.abs(rotation - coin.angle);
        const distance = Math.min(diff, 360 - diff);
        const intensity = Math.max(0, 1 - distance / 30); // fade out after 30°

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
              className="rounded-full"
            />
          </div>
        );
      })}
    </div>
  );
};

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
