"use client";

import { useEffect, useRef } from "react";

interface Star { x: number; y: number; size: number; phase: number; speed: number; layer: number; }
interface Shooter { x: number; y: number; len: number; vx: number; vy: number; opacity: number; active: boolean; }
interface Satellite {
  x: number; y: number; vx: number; vy: number;
  blinkPhase: number; blinkSpeed: number; blinkAmp: number;
  trailLen: number; trail: { x: number; y: number }[];
  type: "normal" | "iss"; // ISS is brighter and faster
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    // ── Stars (3 layers) ────────────────────────────────────────────────────
    const stars: Star[] = [
      ...Array.from({ length: 120 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        size: Math.random() * 0.6 + 0.2,
        phase: Math.random() * Math.PI * 2, speed: Math.random() * 0.008 + 0.003, layer: 0,
      })),
      ...Array.from({ length: 100 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        size: Math.random() * 1.0 + 0.4,
        phase: Math.random() * Math.PI * 2, speed: Math.random() * 0.018 + 0.008, layer: 1,
      })),
      ...Array.from({ length: 40 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        size: Math.random() * 1.6 + 0.8,
        phase: Math.random() * Math.PI * 2, speed: Math.random() * 0.03 + 0.02, layer: 2,
      })),
    ];

    // ── Akash Ganga (Milky Way) ─────────────────────────────────────────────
    // Band runs diagonally: top-right → bottom-left
    // We parameterise points along the spine and scatter dust around it.
    const bandAngle = -38 * (Math.PI / 180); // diagonal tilt
    const cosA = Math.cos(bandAngle), sinA = Math.sin(bandAngle);

    // Core dust — tightly packed bright micro-stars along the spine
    const mwCore = Array.from({ length: 600 }, () => {
      const along = (Math.random() - 0.5) * Math.max(W, H) * 1.6;
      const across = (Math.random() - 0.5) * 55 * Math.pow(Math.random(), 0.6);
      const cx = W * 0.55 + along * cosA - across * sinA;
      const cy = H * 0.42 + along * sinA + across * cosA;
      const distFromCenter = Math.abs(across);
      return {
        x: cx, y: cy,
        size: Math.random() * 0.7 + 0.15,
        // brighter near spine, fainter at edges
        a: (0.55 - distFromCenter / 80) * (Math.random() * 0.6 + 0.4),
        // slight colour variety: bluish-white to warm white
        r: Math.floor(190 + Math.random() * 65),
        g: Math.floor(195 + Math.random() * 55),
        b: Math.floor(210 + Math.random() * 45),
      };
    });

    // Outer haze — looser scatter further from the spine
    const mwHaze = Array.from({ length: 300 }, () => {
      const along = (Math.random() - 0.5) * Math.max(W, H) * 1.8;
      const across = (Math.random() - 0.5) * 130;
      const cx = W * 0.55 + along * cosA - across * sinA;
      const cy = H * 0.42 + along * sinA + across * cosA;
      return { x: cx, y: cy, a: Math.random() * 0.13 + 0.02 };
    });

    // ── Shooting stars ──────────────────────────────────────────────────────
    const shooters: Shooter[] = Array.from({ length: 4 }, () => ({
      x: 0, y: 0, len: 0, vx: 0, vy: 0, opacity: 0, active: false,
    }));
    const spawnShooter = (s: Shooter) => {
      const angle = (Math.random() * 28 + 14) * (Math.PI / 180);
      const speed = Math.random() * 12 + 8;
      s.x = Math.random() * W * 0.65; s.y = Math.random() * H * 0.38;
      s.len = Math.random() * 150 + 90;
      s.vx = Math.cos(angle) * speed; s.vy = Math.sin(angle) * speed;
      s.opacity = 1; s.active = true;
    };
    [1000, 4500, 8000, 13000].forEach((d, i) => setTimeout(() => spawnShooter(shooters[i]), d));

    // ── Satellites ──────────────────────────────────────────────────────────
    const spawnSatellite = (type: "normal" | "iss" = "normal"): Satellite => {
      const edge = Math.floor(Math.random() * 4);
      const speed = type === "iss"
        ? Math.random() * 0.5 + 0.8   // ISS faster
        : Math.random() * 0.4 + 0.25; // normal slower
      const angleBase = edge === 0 ? 18 : edge === 1 ? 162 : edge === 2 ? 198 : 342;
      const angle = (angleBase + Math.random() * 36 - 18) * (Math.PI / 180);
      let x = 0, y = 0;
      if (edge === 0)      { x = Math.random() * W; y = -14; }
      else if (edge === 1) { x = W + 14; y = Math.random() * H * 0.6; }
      else if (edge === 2) { x = Math.random() * W; y = H + 14; }
      else                 { x = -14; y = Math.random() * H * 0.6; }
      return {
        x, y, type,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        blinkPhase: Math.random() * Math.PI * 2,
        blinkSpeed: type === "iss" ? 0.06 : Math.random() * 0.03 + 0.012,
        blinkAmp: type === "iss" ? 0.7 : 0.4,
        trailLen: type === "iss" ? 22 : Math.floor(Math.random() * 14 + 8),
        trail: [],
      };
    };

    const satellites: Satellite[] = [];
    // 3 normal + 1 ISS
    [2000, 11000, 20000].forEach((d) => setTimeout(() => satellites.push(spawnSatellite("normal")), d));
    setTimeout(() => satellites.push(spawnSatellite("iss")), 6000);

    // ── Planets — arranged along the ecliptic diagonal ─────────────────────
    const planetDefs = [
      {
        name: "Mercury",
        px: 0.06, py: 0.72,
        r: 1.5,
        glow: "rgba(160,160,170,0.85)",
        fill: "rgba(170,168,175,1)",
        haloColor: "rgba(160,160,170,0.14)",
        rings: false, glowSize: 7,
        phase: Math.random() * Math.PI * 2,
      },
      {
        name: "Venus",
        px: 0.20, py: 0.52,
        r: 3.0,
        glow: "rgba(255,248,200,1)",
        fill: "rgba(255,252,210,1)",
        haloColor: "rgba(255,248,180,0.28)",
        rings: false, glowSize: 18,
        phase: Math.random() * Math.PI * 2,
      },
      {
        name: "Mars",
        px: 0.34, py: 0.32,
        r: 2.2,
        glow: "rgba(220,70,40,0.9)",
        fill: "rgba(220,80,50,1)",
        haloColor: "rgba(220,80,50,0.22)",
        rings: false, glowSize: 10,
        phase: Math.random() * Math.PI * 2,
      },
      {
        name: "Jupiter",
        px: 0.50, py: 0.14,
        r: 3.6,
        glow: "rgba(240,210,150,0.9)",
        fill: "rgba(245,215,160,1)",
        haloColor: "rgba(240,210,150,0.20)",
        rings: false, glowSize: 15,
        phase: Math.random() * Math.PI * 2,
      },
      {
        name: "Saturn",
        px: 0.65, py: 0.24,
        r: 2.8,
        glow: "rgba(210,180,90,0.9)",
        fill: "rgba(218,185,100,1)",
        haloColor: "rgba(210,180,90,0.18)",
        rings: true, glowSize: 11,
        phase: Math.random() * Math.PI * 2,
      },
      {
        name: "Uranus",
        px: 0.78, py: 0.38,
        r: 2.0,
        glow: "rgba(100,220,220,0.85)",
        fill: "rgba(120,230,225,1)",
        haloColor: "rgba(100,220,220,0.15)",
        rings: true, glowSize: 9,
        phase: Math.random() * Math.PI * 2,
      },
      {
        name: "Neptune",
        px: 0.90, py: 0.52,
        r: 1.8,
        glow: "rgba(60,80,220,0.85)",
        fill: "rgba(80,100,235,1)",
        haloColor: "rgba(60,80,220,0.15)",
        rings: false, glowSize: 8,
        phase: Math.random() * Math.PI * 2,
      },
    ];

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t++;

      // ── Akash Ganga ───────────────────────────────────────────────────────
      // 1. Soft glow band
      {
        const cx = W * 0.55, cy = H * 0.42;
        const len = Math.max(W, H) * 1.8;
        const x0 = cx + len * cosA, y0 = cy + len * sinA;
        const x1 = cx - len * cosA, y1 = cy - len * sinA;
        const nx = -sinA, ny = cosA;
        const hw = 90;
        const g = ctx.createLinearGradient(cx + nx * hw, cy + ny * hw, cx - nx * hw, cy - ny * hw);
        g.addColorStop(0,    "rgba(100,100,180,0)");
        g.addColorStop(0.25, "rgba(140,130,200,0.04)");
        g.addColorStop(0.45, "rgba(170,160,220,0.09)");
        g.addColorStop(0.5,  "rgba(200,190,240,0.14)");
        g.addColorStop(0.55, "rgba(170,160,220,0.09)");
        g.addColorStop(0.75, "rgba(140,130,200,0.04)");
        g.addColorStop(1,    "rgba(100,100,180,0)");
        ctx.save();
        ctx.strokeStyle = g;
        ctx.lineWidth = hw * 2;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        ctx.restore();
      }
      // 2. Outer haze
      for (const m of mwHaze) {
        ctx.beginPath();
        ctx.arc(m.x, m.y, 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,185,220,${m.a.toFixed(2)})`;
        ctx.fill();
      }
      // 3. Core dust
      for (const m of mwCore) {
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${m.r},${m.g},${m.b},${Math.min(m.a, 0.9).toFixed(2)})`;
        ctx.fill();
      }

      // Stars
      for (const s of stars) {
        const tw = 0.3 + 0.7 * Math.sin(s.phase + t * s.speed);
        const baseAlpha = s.layer === 0 ? 0.55 : s.layer === 1 ? 0.80 : 1.0;
        if (s.layer === 2 && tw > 0.85) { ctx.shadowColor = "rgba(255,255,255,0.8)"; ctx.shadowBlur = 6; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${(tw * baseAlpha).toFixed(2)})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── Planets ────────────────────────────────────────────────────────────
      for (const p of planetDefs) {
        const px = p.px * W, py = p.py * H;
        // gentle shimmer
        const shimmer = 0.85 + 0.15 * Math.sin(p.phase + t * 0.008);

        // halo
        const halo = ctx.createRadialGradient(px, py, 0, px, py, p.r * 7);
        halo.addColorStop(0, p.haloColor);
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(px, py, p.r * 7, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Rings — Saturn tilted, Uranus nearly vertical
        if (p.rings) {
          ctx.save();
          ctx.translate(px, py);
          const isSaturn = p.name === "Saturn";
          ctx.rotate(isSaturn ? -0.28 : 1.2);
          ctx.scale(1, isSaturn ? 0.35 : 0.25);
          const ringColor = isSaturn ? "200,165,75" : "100,220,220";
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 3.8, p.r * 3.8, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${ringColor},${(0.55 * shimmer).toFixed(2)})`;
          ctx.lineWidth = isSaturn ? 1.8 : 1.2;
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r * 2.7, p.r * 2.7, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${ringColor},${(0.35 * shimmer).toFixed(2)})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
          ctx.restore();
        }

        // planet body glow
        ctx.shadowColor = p.glow;
        ctx.shadowBlur = p.glowSize * shimmer;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.fill;
        ctx.fill();
        ctx.shadowBlur = 0;

        // tiny label
        ctx.font = "9px monospace";
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.textAlign = "center";
        ctx.fillText(p.name, px, py + p.r + 10);
      }

      // ── Shooting stars ─────────────────────────────────────────────────────
      for (const s of shooters) {
        if (!s.active) continue;
        s.x += s.vx; s.y += s.vy; s.opacity -= 0.011;
        if (s.opacity <= 0 || s.x > W + 60 || s.y > H + 60) {
          s.active = false;
          setTimeout(() => spawnShooter(s), Math.random() * 5000 + 3000);
          continue;
        }
        const mag = Math.hypot(s.vx, s.vy);
        const tx = s.x - (s.vx / mag) * s.len, ty = s.y - (s.vy / mag) * s.len;
        const grad = ctx.createLinearGradient(s.x, s.y, tx, ty);
        grad.addColorStop(0, `rgba(255,255,255,${s.opacity.toFixed(2)})`);
        grad.addColorStop(0.35, `rgba(200,180,255,${(s.opacity * 0.45).toFixed(2)})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(tx, ty);
        ctx.strokeStyle = grad; ctx.lineWidth = 1.8; ctx.stroke();
        ctx.beginPath(); ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity.toFixed(2)})`; ctx.fill();
      }

      // ── Satellites ─────────────────────────────────────────────────────────
      for (let i = satellites.length - 1; i >= 0; i--) {
        const s = satellites[i];

        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > s.trailLen) s.trail.shift();
        s.x += s.vx; s.y += s.vy;

        if (s.x < -50 || s.x > W + 50 || s.y < -50 || s.y > H + 50) {
          satellites.splice(i, 1);
          const type = Math.random() < 0.25 ? "iss" : "normal";
          setTimeout(() => satellites.push(spawnSatellite(type)), Math.random() * 9000 + 4000);
          continue;
        }

        // trail
        for (let j = 1; j < s.trail.length; j++) {
          const frac = j / s.trail.length;
          ctx.beginPath();
          ctx.moveTo(s.trail[j - 1].x, s.trail[j - 1].y);
          ctx.lineTo(s.trail[j].x, s.trail[j].y);
          const trailAlpha = s.type === "iss" ? frac * 0.55 : frac * 0.30;
          ctx.strokeStyle = s.type === "iss"
            ? `rgba(255,240,200,${trailAlpha.toFixed(2)})`
            : `rgba(200,220,255,${trailAlpha.toFixed(2)})`;
          ctx.lineWidth = s.type === "iss" ? 1.2 : 0.8;
          ctx.stroke();
        }

        // blink
        const blink = 0.5 + s.blinkAmp * Math.sin(s.blinkPhase + t * s.blinkSpeed);
        const alpha = Math.max(0.3, Math.min(1, 0.55 + blink * 0.45));
        const dotR = s.type === "iss" ? 2.0 : 1.4;

        ctx.beginPath();
        ctx.arc(s.x, s.y, dotR, 0, Math.PI * 2);
        ctx.shadowColor = s.type === "iss" ? "rgba(255,230,150,0.95)" : "rgba(180,210,255,0.85)";
        ctx.shadowBlur = blink > 0.6 ? (s.type === "iss" ? 10 : 6) : 2;
        ctx.fillStyle = s.type === "iss"
          ? `rgba(255,235,160,${alpha.toFixed(2)})`
          : `rgba(210,230,255,${alpha.toFixed(2)})`;
        ctx.fill();
        ctx.shadowBlur = 0;

        // tiny "ISS" label when bright enough
        if (s.type === "iss" && blink > 0.7) {
          ctx.font = "7px monospace";
          ctx.fillStyle = `rgba(255,235,160,${(blink * 0.5).toFixed(2)})`;
          ctx.textAlign = "center";
          ctx.fillText("ISS", s.x, s.y - 7);
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
