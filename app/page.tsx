"use client";

import CountdownTimer from "@/components/CountdownTimer";
import InstallPrompt from "@/components/InstallPrompt";
import PushNotificationManager from "@/components/PushNotificationManager";


export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">

      {/* Animated Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 w-96 h-96 bg-purple-600/40 blur-3xl rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/30 blur-3xl rounded-full animate-pulse"></div>
      </div>

      <CountdownTimer />
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  );
}


