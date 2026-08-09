"use client";

import React, { useEffect, useState } from "react";

const TARGETS = [
  {
    label: "Target 1",
    date: new Date("2027-01-21T00:00:00"),
    bar: "bg-gradient-to-r from-violet-500 to-purple-600",
    dot: "bg-purple-400",
    cardBg: "bg-purple-500/10",
    cardBorder: "border-purple-400/25",
    numColor: "from-violet-400 to-purple-500",
  },
  {
    label: "Target 2",
    date: new Date("2027-10-11T00:00:00"),
    bar: "bg-gradient-to-r from-cyan-500 to-blue-600",
    dot: "bg-blue-400",
    cardBg: "bg-blue-500/10",
    cardBorder: "border-blue-400/25",
    numColor: "from-cyan-400 to-blue-500",
  },
];

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

function CountdownCard({ target, isDay }: { target: typeof TARGETS[number]; isDay: boolean }) {
  const tl = useCountdown(target.date);
  const units = [
    { label: "Days", value: tl.days },
    { label: "Hrs", value: tl.hours },
    { label: "Mins", value: tl.minutes },
    { label: "Secs", value: tl.seconds },
  ];

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: isDay ? "rgba(255,255,255,0.35)" : undefined,
        border: isDay ? "1px solid rgba(255,255,255,0.55)" : undefined,
        transition: "background 1.2s ease, border 1.2s ease",
      }}
    >
      {!isDay && <div className={`h-[2px] w-full ${target.bar}`} />}
      {isDay && <div className="h-[2px] w-full" style={{ background: "linear-gradient(to right, #f59e0b, #fde047)" }} />}

      <div
        className={`px-4 py-4 space-y-4 ${!isDay ? `${target.cardBg} border ${target.cardBorder}` : ""}`}
      >
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${target.dot} shrink-0`} />
            <p
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: isDay ? "#0c4a6e" : "rgba(255,255,255,0.75)", transition: "color 1.2s ease" }}
            >{target.label}</p>
          </div>
          <p
            className="text-xs font-semibold"
            style={{ color: isDay ? "#0c4a6e" : "rgba(255,255,255,0.90)", transition: "color 1.2s ease" }}
          >
            {target.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>

        {/* countdown boxes */}
        <div className="grid grid-cols-4 gap-2">
          {units.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl py-3 flex flex-col items-center gap-1"
              style={{
                background: isDay ? "rgba(255,255,255,0.50)" : "rgba(255,255,255,0.06)",
                border: isDay ? "1px solid rgba(255,255,255,0.60)" : "1px solid rgba(255,255,255,0.10)",
                transition: "background 1.2s ease, border 1.2s ease",
              }}
            >
              <span
                className={`text-lg font-black tabular-nums leading-none ${!isDay ? `bg-gradient-to-b ${target.numColor} bg-clip-text text-transparent` : ""}`}
                style={{ color: isDay ? "#0369a1" : undefined, transition: "color 1.2s ease" }}
              >
                {String(value).padStart(2, "0")}
              </span>
              <span
                className="text-[9px] uppercase tracking-widest font-medium"
                style={{ color: isDay ? "rgba(3,105,161,0.55)" : "rgba(255,255,255,0.35)", transition: "color 1.2s ease" }}
              >{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CountdownTimer({ isDay = false }: { isDay?: boolean }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full px-1 max-w-[99vw] mx-auto" style={{ transition: "all 1.2s ease" }}>
      <div
        className="w-full rounded-3xl overflow-hidden backdrop-blur-3xl"
        style={{
          background: isDay ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.06)",
          border: isDay ? "1px solid rgba(255,255,255,0.60)" : "1px solid rgba(255,255,255,0.12)",
          boxShadow: isDay
            ? "inset 0 1px 0 rgba(255,255,255,0.7), 0 16px 48px rgba(0,0,0,0.12), 0 0 40px rgba(251,191,36,0.10)"
            : "inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.80), 0 0 60px rgba(124,58,237,0.12)",
          transition: "background 1.2s ease, border 1.2s ease, box-shadow 1.2s ease",
        }}
      >
        {/* top accent line */}
        <div
          className="h-px w-full"
          style={{
            background: isDay
              ? "linear-gradient(to right, #f59e0b, #fde047, #38bdf8)"
              : "linear-gradient(to right, #7c3aed, #818cf8, #3b82f6)",
            transition: "background 1.2s ease",
          }}
        />

        <div className="px-4 py-5 space-y-4">
          {/* title */}
          <div className="text-center">
            <h1
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: isDay ? "#0c4a6e" : "#ffffff", transition: "color 1.2s ease" }}
            >
              Days Counter
            </h1>
            <p
              className="text-[11px] mt-0.5 tracking-wide"
              style={{ color: isDay ? "rgba(12,74,110,0.6)" : "rgba(255,255,255,0.35)", transition: "color 1.2s ease" }}
            >
              How long until the day?
            </p>
          </div>

          {/* today row */}
          <div
            className="rounded-2xl px-4 py-3"
            style={{
              background: isDay ? "rgba(255,255,255,0.40)" : "rgba(255,255,255,0.05)",
              border: isDay ? "1px solid rgba(255,255,255,0.55)" : "1px solid rgba(255,255,255,0.10)",
              transition: "background 1.2s ease, border 1.2s ease",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-[9px] uppercase tracking-widest font-semibold"
                  style={{ color: isDay ? "rgba(12,74,110,0.55)" : "rgba(255,255,255,0.35)", transition: "color 1.2s ease" }}
                >Today</p>
                <p
                  className="text-sm font-semibold mt-0.5 leading-snug"
                  style={{ color: isDay ? "#0c4a6e" : "#ffffff", transition: "color 1.2s ease" }}
                >
                  {now.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <p
                className="text-sm font-mono font-semibold tabular-nums"
                style={{ color: isDay ? "rgba(12,74,110,0.65)" : "rgba(255,255,255,0.50)", transition: "color 1.2s ease" }}
              >
                {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </p>
            </div>
          </div>

          {/* both countdowns stacked */}
          <div className="flex flex-col gap-3">
            {TARGETS.map((t) => (
              <CountdownCard key={t.label} target={t} isDay={isDay} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
