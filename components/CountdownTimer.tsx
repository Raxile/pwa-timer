import React, { useEffect, useMemo, useState } from "react";

const CountdownTimer = () => {
  const targetDate = useMemo(() => new Date("2027-10-11T00:00:00"), []);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) return;

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="relative w-full max-w-xl p-8 rounded-3xl backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
      {/* Neon Title */}
      <h1 className="text-4xl font-extrabold text-center mb-8 text-white tracking-wide ">
        Countdown to the Day
      </h1>

      {/* Today + Target */}
      <div className="space-y-4 mb-8">
        {/* Today */}
        <div className="p-4 rounded-xl bg-white/10 border border-white/30 shadow-lg backdrop-blur-md hover:bg-white/20 transition">
          <p className="text-sm opacity-80">Today</p>
          <p className="text-xl font-semibold">
            {currentTime.toLocaleString()}
          </p>
        </div>

        {/* Target */}
        <div className="p-4 rounded-xl bg-white/10 border border-white/30 shadow-lg backdrop-blur-md hover:bg-white/20 transition">
          <p className="text-sm opacity-80">Target Date</p>
          <p className="text-xl font-semibold">{targetDate.toLocaleString()}</p>
        </div>
      </div>

      {/* Countdown Boxes */}
      <div className="grid grid-cols-4 gap-4">
        <TimeCard label="Days" value={timeLeft.days} />
        <TimeCard label="Hours" value={timeLeft.hours} />
        <TimeCard label="Minutes" value={timeLeft.minutes} />
        <TimeCard label="Seconds" value={timeLeft.seconds} />
      </div>
    </div>
  );
};

export default CountdownTimer;

function TimeCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="p-5 bg-white/10 rounded-2xl border border-white/20 shadow-xl backdrop-blur-xl
      hover:scale-[1.05] hover:bg-white/20 transition-all duration-300
      flex flex-col items-center justify-center
      animate-[glow_3s_ease-in-out_infinite]"
    >
      <p className="text-4xl font-bold text-white ">{value}</p>
      <p className="text-xs mt-1 text-white/70 tracking-widest uppercase">
        {label}
      </p>
    </div>
  );
}
