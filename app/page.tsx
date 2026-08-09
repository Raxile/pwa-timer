"use client";

import { useState } from "react";
import CountdownTimer from "@/components/CountdownTimer";
import InstallPrompt from "@/components/InstallPrompt";
import StarField from "@/components/StarField";

export default function Home() {
  const [isDay, setIsDay] = useState(false);

  return (
    <div
      className="min-h-[100dvh] w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: isDay
          ? "linear-gradient(180deg, #0369a1 0%, #0284c7 25%, #38bdf8 60%, #7dd3fc 85%, #bae6fd 100%)"
          : "linear-gradient(180deg, #01010c 0%, #030318 35%, #06061e 65%, #08081a 100%)",
        transition: "background 1.4s ease",
      }}
    >
      {/* Starfield — fades out during day */}
      <div style={{ opacity: isDay ? 0 : 1, transition: "opacity 1.2s ease", position: "absolute", inset: 0 }}>
        <StarField />
      </div>

      {/* ── Background layers ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>

        {/* NIGHT orbs */}
        <div style={{ opacity: isDay ? 0 : 1, transition: "opacity 1.4s ease" }}>
          <div className="orb-1 absolute -top-40 -left-32 w-[640px] h-[640px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(109,40,217,0.48) 0%, transparent 65%)", filter: "blur(75px)" }} />
          <div className="orb-2 absolute -bottom-48 -right-24 w-[580px] h-[580px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(88,28,220,0.38) 0%, transparent 65%)", filter: "blur(80px)" }} />
          <div className="orb-4 absolute -bottom-16 left-0 w-[380px] h-[380px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(180,100,0,0.22) 0%, transparent 65%)", filter: "blur(90px)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(55,48,180,0.13) 0%, transparent 70%)", filter: "blur(130px)" }} />
        </div>

        {/* DAY orbs — warm sun scatter */}
        <div style={{ opacity: isDay ? 1 : 0, transition: "opacity 1.4s ease" }}>
          {/* sun corona top-right */}
          <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(253,224,71,0.35) 0%, rgba(251,146,60,0.15) 50%, transparent 70%)", filter: "blur(80px)" }} />
          {/* warm ambient fill */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(186,230,253,0.25) 0%, transparent 70%)", filter: "blur(100px)" }} />
          {/* horizon gold */}
          <div className="absolute bottom-0 left-0 right-0 h-56"
            style={{ background: "linear-gradient(to top, rgba(251,191,36,0.18) 0%, transparent 100%)" }} />
        </div>

        {/* NIGHT clouds — dark wisps */}
        <div style={{ opacity: isDay ? 0 : 1, transition: "opacity 1.2s ease" }}>
          <div className="cloud-a absolute"
            style={{ top: "8%", left: "-5%", width: "460px", height: "120px",
              background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.055) 0%, transparent 100%)",
              filter: "blur(38px)", borderRadius: "50%" }} />
          <div className="cloud-b absolute"
            style={{ top: "14%", right: "-4%", width: "380px", height: "100px",
              background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.045) 0%, transparent 100%)",
              filter: "blur(42px)", borderRadius: "50%" }} />
          <div className="cloud-c absolute"
            style={{ top: "6%", right: "8%", width: "280px", height: "80px",
              background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(254,240,138,0.06) 0%, transparent 100%)",
              filter: "blur(30px)", borderRadius: "50%" }} />
          <div className="cloud-d absolute"
            style={{ bottom: "22%", left: "15%", width: "340px", height: "90px",
              background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.030) 0%, transparent 100%)",
              filter: "blur(45px)", borderRadius: "50%" }} />
          <div className="absolute bottom-0 left-0 right-0 h-40"
            style={{ background: "linear-gradient(to top, rgba(80,40,160,0.14) 0%, transparent 100%)" }} />
        </div>

        {/* DAY clouds — bright puffy white */}
        <div style={{ opacity: isDay ? 1 : 0, transition: "opacity 1.4s ease" }}>
          <div className="day-cloud-a absolute"
            style={{ top: "12%", left: "-8%", width: "520px", height: "140px",
              background: "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.20) 60%, transparent 100%)",
              filter: "blur(22px)", borderRadius: "50%" }} />
          <div className="day-cloud-b absolute"
            style={{ top: "22%", right: "-6%", width: "440px", height: "120px",
              background: "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.18) 60%, transparent 100%)",
              filter: "blur(25px)", borderRadius: "50%" }} />
          <div className="day-cloud-a absolute"
            style={{ bottom: "28%", left: "10%", width: "360px", height: "100px",
              background: "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(255,255,255,0.40) 0%, rgba(255,255,255,0.12) 60%, transparent 100%)",
              filter: "blur(28px)", borderRadius: "50%", animationDelay: "6s" }} />
          <div className="day-cloud-b absolute"
            style={{ bottom: "15%", right: "5%", width: "300px", height: "85px",
              background: "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.10) 60%, transparent 100%)",
              filter: "blur(30px)", borderRadius: "50%", animationDelay: "12s" }} />
        </div>

        {/* ── MOON (night) ── */}
        <button
          onClick={() => setIsDay(true)}
          className="absolute"
          style={{
            top: "52px", right: "72px", zIndex: 10,
            opacity: isDay ? 0 : 1,
            transition: "opacity 0.8s ease",
            pointerEvents: isDay ? "none" : "auto",
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}
          title="Switch to day"
        >
          {/* outer halo */}
          <div className="moon-halo absolute rounded-full"
            style={{ width: "130px", height: "130px", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              background: "radial-gradient(circle, rgba(254,249,195,0.22) 0%, rgba(254,240,138,0.08) 45%, transparent 70%)",
              filter: "blur(18px)" }} />
          {/* mid glow */}
          <div className="absolute rounded-full"
            style={{ width: "80px", height: "80px", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              background: "radial-gradient(circle, rgba(254,249,195,0.30) 0%, transparent 70%)",
              filter: "blur(8px)" }} />
          {/* crescent */}
          <div style={{ width: "54px", height: "54px", borderRadius: "50%",
            background: "transparent", position: "relative", zIndex: 3,
            boxShadow: "inset -13px -3px 0 9px #fef9c3, inset -13px -3px 18px 3px rgba(253,224,71,0.35), 0 0 18px rgba(254,249,195,0.35)" }} />
        </button>

        {/* ── SUN (day) ── */}
        <button
          onClick={() => setIsDay(false)}
          className="absolute"
          style={{
            top: "40px", right: "60px", zIndex: 10,
            opacity: isDay ? 1 : 0,
            transition: "opacity 0.8s ease",
            pointerEvents: isDay ? "auto" : "none",
            background: "none", border: "none", cursor: "pointer", padding: 0,
            width: "80px", height: "80px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          title="Switch to night"
        >
          {/* wide corona */}
          <div className="sun-glow absolute rounded-full"
            style={{ width: "150px", height: "150px",
              background: "radial-gradient(circle, rgba(253,224,71,0.45) 0%, rgba(251,146,60,0.20) 45%, transparent 70%)",
              filter: "blur(20px)" }} />
          {/* rotating rays */}
          <div className="sun-rays absolute" style={{ width: "80px", height: "80px" }}>
            <svg viewBox="0 0 80 80" width="80" height="80">
              {Array.from({ length: 12 }, (_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const x1 = 40 + 28 * Math.cos(angle), y1 = 40 + 28 * Math.sin(angle);
                const x2 = 40 + 38 * Math.cos(angle), y2 = 40 + 38 * Math.sin(angle);
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="rgba(253,224,71,0.75)" strokeWidth={i % 3 === 0 ? 2.5 : 1.5} strokeLinecap="round" />
                );
              })}
            </svg>
          </div>
          {/* sun body */}
          <div className="relative rounded-full"
            style={{ width: "42px", height: "42px", zIndex: 3,
              background: "radial-gradient(circle at 40% 38%, #fff7ed 0%, #fde047 40%, #f59e0b 100%)",
              boxShadow: "0 0 20px rgba(253,224,71,0.9), 0 0 40px rgba(251,146,60,0.5), 0 0 70px rgba(253,224,71,0.25)" }} />
        </button>

      </div>

      {/* Card */}
      <div
        className="relative w-full max-w-lg"
        style={{
          zIndex: 2,
          filter: isDay ? "drop-shadow(0 8px 32px rgba(0,0,0,0.15))" : "drop-shadow(0 8px 32px rgba(0,0,0,0.6))",
          transition: "filter 1.4s ease",
        }}
      >
        <CountdownTimer isDay={isDay} />
      </div>

      <InstallPrompt />
    </div>
  );
}
