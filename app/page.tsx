"use client";

import { Inter, Montserrat } from "next/font-google";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["800"] });
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    d: "00",
    h: "00",
    m: "00",
    s: "00",
  });
  const [nanos, setNanos] = useState("000");
  const requestRef = useRef<number>();

  // Target Date: Jan 20, 2026
  const targetDate = new Date("Jan 20, 2026 00:00:00").getTime();

  const updateNanos = () => {
    const flicker = Math.floor(Math.random() * 999);
    setNanos(flicker.toString().padStart(3, "0"));
    requestRef.current = requestAnimationFrame(updateNanos);
  };

  useEffect(() => {
    // Start Nano Engine
    requestRef.current = requestAnimationFrame(updateNanos);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24))
            .toString()
            .padStart(2, "0"),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            .toString()
            .padStart(2, "0"),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            .toString()
            .padStart(2, "0"),
          s: Math.floor((distance % (1000 * 60)) / 1000)
            .toString()
            .padStart(2, "0"),
        });
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-[#050507] text-white selection:bg-indigo-500/30 ${inter.className}`}>
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-pink-500/10 blur-[120px]" />

      <main className="relative z-10 flex w-full max-w-4xl flex-col items-center px-6 text-center">
        {/* Top Logo/Badge */}
        <div className="mb-8 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={60}
            height={12}
            priority
          />
          <span className="h-4 w-[1px] bg-white/20" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">
            Team Binay SMT
          </span>
        </div>

        {/* Title */}
        <h1
          className={`${montserrat.className} mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-8xl`}>
          Junyet Alam
        </h1>
        <p className="mb-12 text-xs uppercase tracking-[0.5em] text-zinc-500">
          Journey Time Remaining
        </p>

        {/* Countdown Grid */}
        <div className="grid w-full grid-cols-3 gap-4 rounded-[40px] border border-white/5 bg-white/[0.02] p-8 backdrop-blur-2xl md:grid-cols-5 md:p-16">
          <TimeUnit value={timeLeft.d} label="Days" />
          <TimeUnit value={timeLeft.h} label="Hours" />
          <TimeUnit value={timeLeft.m} label="Mins" />
          <TimeUnit value={timeLeft.s} label="Secs" />
          <TimeUnit value={nanos} label="Nano" isNano />
        </div>

        {/* Bottom Actions */}
        <div className="mt-16 flex flex-col gap-4 sm:flex-row">
          <button className="flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95">
            View Roadmap
          </button>
          <a
            href="https://nextjs.org/docs"
            className="flex h-12 items-center justify-center rounded-full border border-white/10 px-8 text-sm font-medium transition-colors hover:bg-white/5">
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}

function TimeUnit({
  value,
  label,
  isNano = false,
}: {
  value: string;
  label: string;
  isNano?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center ${
        !isNano ? "border-r border-white/5" : "col-span-3 md:col-span-1"
      }`}>
      <span
        className={`tabular-nums text-4xl font-bold tracking-tighter md:text-7xl ${
          isNano ? "text-pink-500" : "text-white"
        }`}>
        {value}
      </span>
      <span
        className={`mt-4 text-[9px] font-black uppercase tracking-[0.3em] ${
          isNano ? "text-pink-500/50" : "text-indigo-400/60"
        }`}>
        {label}
      </span>
    </div>
  );
}
