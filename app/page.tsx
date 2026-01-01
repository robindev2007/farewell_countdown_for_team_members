"use client";

import {
  clearAllMessages,
  getMessages,
  sendMessage,
} from "@/app/actions/message";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import useSWR from "swr";

// --- Sub-Component: TimeUnit ---
function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="relative flex flex-col items-center justify-center py-8 md:py-12 transition-all group hover:bg-white/[0.04] border-white/10 border-r last:border-r-0">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 blur-[60px] transition-opacity duration-700 bg-cyan-600" />
      <span className="relative font-mont tabular-nums text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter transition-all duration-500 group-hover:scale-105 text-white">
        {value}
      </span>
      <span className="relative mt-2 font-sans text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 group-hover:text-zinc-200">
        {label}
      </span>
    </div>
  );
}

// --- Sub-Component: FeatureCard ---
function FeatureCard({
  title,
  text,
  color,
}: {
  title: string;
  text: string;
  color: "cyan" | "fuchsia" | "orange";
}) {
  const themes = {
    cyan: "hover:border-cyan-500/50 text-cyan-400 bg-cyan-500/5",
    fuchsia: "hover:border-fuchsia-500/50 text-fuchsia-400 bg-fuchsia-500/5",
    orange: "hover:border-orange-500/50 text-orange-400 bg-orange-500/5",
  };
  return (
    <div
      className={`group rounded-3xl border border-white/10 p-8 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1 shadow-xl ${themes[color]}`}>
      <h4 className="mb-4 text-[10px] font-black uppercase tracking-widest opacity-80">
        {title}
      </h4>
      <p className="text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-200">
        {text}
      </p>
    </div>
  );
}

export default function JunyetFarewell() {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({ name: "", content: "" });
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: messages, mutate } = useSWR("messages", () => getMessages(), {
    refreshInterval: 3000,
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;
    startTransition(async () => {
      await sendMessage(formData);
      setFormData({ name: "", content: "" });
      mutate();
    });
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await clearAllMessages(adminPass);
      mutate([]);
      setShowAdmin(false);
      setAdminPass("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // --- TIMER ENGINE ---
  const [timeLeft, setTimeLeft] = useState({
    d: "00",
    h: "00",
    m: "00",
    s: "00",
  });

  const targetDate = new Date("2026-01-20T00:00:00+06:00").getTime();

  useEffect(() => {
    const calculateTime = () => {
      const distance = targetDate - Date.now();
      if (distance <= 0) {
        setTimeLeft({ d: "00", h: "00", m: "00", s: "00" });
        return false;
      }
      setTimeLeft({
        d: Math.floor(distance / 86400000)
          .toString()
          .padStart(2, "0"),
        h: Math.floor((distance % 86400000) / 3600000)
          .toString()
          .padStart(2, "0"),
        m: Math.floor((distance % 3600000) / 60000)
          .toString()
          .padStart(2, "0"),
        s: Math.floor((distance % 60000) / 1000)
          .toString()
          .padStart(2, "0"),
      });
      return true;
    };

    calculateTime(); // Initial call
    const timer = setInterval(() => {
      const active = calculateTime();
      if (!active) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-hidden bg-[#05050a] text-zinc-100 font-sans selection:bg-cyan-500/30">
      {/* Background FX */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[1000px] w-[1000px] rounded-full bg-indigo-600/10 blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[800px] w-[800px] rounded-full bg-rose-500/10 blur-[120px] animate-blob" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 py-12 md:py-20">
        {/* Avatar & Branding */}
        <div className="relative mb-8 group">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-orange-500 opacity-20 blur-xl group-hover:opacity-60 transition duration-1000 animate-shimmer bg-[length:200%_auto]" />
          <div className="relative h-32 w-32 md:h-48 md:w-48  rounded-full border border-white/10 shadow-2xl">
            <Image
              src="/junayet-alam-profile.avif"
              alt="Junyet Alam"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-125 origin-bottom"
            />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-black px-4 py-1 backdrop-blur-md">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-400">
              SM_TECH
            </span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center mb-12">
          <h1 className="font-mont text-5xl md:text-8xl font-black tracking-tighter leading-none mb-4">
            <span className="block opacity-70 text-white">Farewell,</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
              Junyet Alam.
            </span>
          </h1>
          <p className="text-zinc-500 uppercase tracking-[0.8em] text-[9px] font-bold">
            Team Binary
          </p>
        </div>

        {/* --- TIMER CONSOLE --- */}
        <div className="relative w-full rounded-[2.5rem] md:rounded-[4rem] border border-white/10 bg-white/[0.02] p-1.5 backdrop-blur-3xl shadow-3xl mb-24">
          <div className="grid w-full grid-cols-2 overflow-hidden rounded-[2.3rem] md:rounded-[3.8rem] bg-black/40 md:grid-cols-4">
            <TimeUnit value={timeLeft.d} label="Days" />
            <TimeUnit value={timeLeft.h} label="Hours" />
            <TimeUnit value={timeLeft.m} label="Minutes" />
            <TimeUnit value={timeLeft.s} label="Seconds" />
          </div>
        </div>

        {/* Messages & Feed */}
        <section className="w-full grid gap-8 lg:grid-cols-5 mb-24">
          <div className="lg:col-span-2 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
            <h3 className="mb-6 text-lg font-bold text-cyan-400 font-mont uppercase tracking-tight">
              Transmission
            </h3>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <input
                type="text"
                placeholder="Identity"
                className="w-full rounded-2xl border border-white/5 bg-black/40 p-4 text-sm outline-none focus:border-cyan-500/50"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <textarea
                placeholder="Your farewell logic..."
                className="h-40 w-full rounded-2xl border border-white/5 bg-black/40 p-4 text-sm outline-none focus:border-fuchsia-500/50 resize-none"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
              <button
                disabled={isPending}
                className="w-full rounded-2xl bg-white text-black py-4 font-black uppercase tracking-widest text-xs hover:bg-cyan-400 transition-all disabled:opacity-50">
                {isPending ? "Syncing..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-3 h-[500px] flex flex-col rounded-[2.5rem] border border-white/10 bg-black/60 overflow-hidden">
            <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                Live Feed
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages?.map((msg: any) => (
                <div
                  key={msg.id}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                      {msg.name || "Anonymous"}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-600">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400">{msg.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Legacy Content */}
        <div className="grid w-full gap-6 md:grid-cols-3 mb-24">
          <FeatureCard
            title="Tech Impact"
            text="Redefining the architecture of SM Technology. Junyet's logic remains a core asset."
            color="cyan"
          />
          <FeatureCard
            title="Team Binary"
            text="More than just code. Jan 20 marks the transition of a mentor and a friend."
            color="fuchsia"
          />
          <FeatureCard
            title="New Sequence"
            text="Initialization of the next high-performance sequence. The journey continues."
            color="orange"
          />
        </div>

        <footer className="w-full flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity">
          <div className="h-px w-32 bg-zinc-800 mb-8" />
          <p className="font-mono text-[8px] uppercase tracking-[1em] mb-4">
            Final Commit 2026 // Junyet Alam
          </p>
          <a
            href="https://github.com/robindev2007"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-cyan-400 transition-colors mb-6">
            Developed by Robin
          </a>
          <button
            onClick={() => setShowAdmin(true)}
            className="mt-2 text-[8px] font-bold uppercase tracking-widest text-zinc-600 border border-zinc-800 rounded-full px-4 py-1">
            System Override
          </button>
        </footer>
      </main>

      {/* Admin Modal */}
      {showAdmin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6">
          <div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-zinc-950 p-8 shadow-2xl text-center">
            <h3 className="text-xl font-black mb-6 uppercase tracking-tighter">
              Auth Required
            </h3>
            <input
              type="password"
              placeholder="Key..."
              autoFocus
              className="w-full bg-black border border-white/10 rounded-xl p-4 mb-4 text-white outline-none focus:border-cyan-500"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowAdmin(false)}
                className="flex-1 text-[10px] font-bold py-4 border border-white/5 rounded-xl">
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={isDeleting}
                className="flex-1 text-[10px] font-bold py-4 bg-red-600 rounded-xl text-white">
                Purge
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap");
        .font-mont {
          font-family: "Montserrat", sans-serif;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite alternate ease-in-out;
        }
        .animate-pulse-slow {
          animation: pulse 12s infinite alternate;
        }
        .animate-shimmer {
          animation: shimmer 5s linear infinite;
        }
        @keyframes shimmer {
          to {
            background-position: 200% center;
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
