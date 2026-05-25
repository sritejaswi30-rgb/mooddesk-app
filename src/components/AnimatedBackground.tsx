/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";

interface AnimatedBackgroundProps {
  type: "image" | "live-stars" | "live-particles" | "live-aurora" | "gradient" | "live-frosted";
  imageUrl: string;
  opacity: number;
}

export default function AnimatedBackground({ type, imageUrl, opacity }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || type === "image" || type === "gradient" || type === "live-frosted") return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Re-adjust boundary dimensions on window resize
    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // Initializer variables for star structures or particle lists
    const particles: {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      fadeSpeed: number;
    }[] = [];

    const numParticles = type === "live-stars" ? 100 : 70;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: type === "live-stars" ? Math.random() * 1.8 + 0.2 : Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * (type === "live-stars" ? 0.05 : 0.4),
        speedY: (Math.random() - 0.5) * (type === "live-stars" ? 0.05 : 0.4) - (type === "live-particles" ? 0.15 : 0.02),
        color:
          type === "live-stars"
            ? "255, 255, 255"
            : ["253, 164, 186", "254, 243, 199", "191, 219, 254", "233, 213, 255"][Math.floor(Math.random() * 4)],
        alpha: Math.random(),
        fadeSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    // Aurora Rise custom points variables
    let auroraY = height * 0.7;
    let time = 0;

    // Canvas Draw Frame loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (type === "live-stars") {
        // Starry Dark Night
        ctx.fillStyle = "#0f172a"; // dark background slate
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          // Adjust star shining
          p.alpha += p.fadeSpeed;
          if (p.alpha <= 0.1 || p.alpha >= 0.95) {
            p.fadeSpeed = -p.fadeSpeed;
          }

          p.x += p.speedX;
          p.y += p.speedY;

          // Wrap boundaries
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${Math.max(0.1, Math.min(1, p.alpha))})`;
          ctx.fill();
        });
      } else if (type === "live-particles") {
        // Floating Warm Pastel Dust (Calming spring)
        // Soft gradient background base
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, "#fbf3e4");
        bgGrad.addColorStop(1, "#f5e6d3");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;

          // Wrap or push from bottom
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, 0.45)`;
          ctx.fill();
        });
      } else if (type === "live-aurora") {
        // Cosmic Aurora lights
        // Gradient base
        const baseGrad = ctx.createLinearGradient(0, 0, width, height);
        baseGrad.addColorStop(0, "#09090b");
        baseGrad.addColorStop(1, "#18181b");
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, width, height);

        time += 0.002;

        // Draw multiple beautiful wave-like layers
        for (let layer = 0; layer < 3; layer++) {
          const shift = layer * 150;
          const greenColor = layer === 0 ? "52, 211, 153" : layer === 1 ? "129, 140, 248" : "244, 63, 94";

          ctx.beginPath();
          ctx.moveTo(0, height);

          // Plot smooth sine wave path across the screen coordinates
          for (let x = 0; x <= width; x += 15) {
            const y =
              auroraY +
              Math.sin(x * 0.0025 + time + layer) * 80 +
              Math.cos(x * 0.001 - time * 0.8) * 40 -
              shift;
            ctx.lineTo(x, y);
          }

          ctx.lineTo(width, height);
          ctx.closePath();

          // Soft gradient auroras
          const auroraGrad = ctx.createLinearGradient(0, height * 0.3, 0, height);
          auroraGrad.addColorStop(0, `rgba(${greenColor}, 0)`);
          auroraGrad.addColorStop(0.5, `rgba(${greenColor}, 0.12)`);
          auroraGrad.addColorStop(1, `rgba(${greenColor}, 0)`);

          ctx.fillStyle = auroraGrad;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type]);

  if (type === "image") {
    return (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${imageUrl})`,
          opacity: opacity / 100,
        }}
      />
    );
  }

  if (type === "gradient") {
    return (
      <div
        className="absolute inset-0 w-full h-full bg-gradient-to-tr from-[#ffe4e6] via-[#fef3c7] to-[#e0f2fe] transition-all duration-700 ease-in-out"
        style={{ opacity: opacity / 100 }}
      />
    );
  }

  if (type === "live-frosted") {
    return (
      <div
        className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out frosted-bg"
        style={{ opacity: opacity / 100 }}
      />
    );
  }

  // Live Canvas
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-700 ease-in-out"
      style={{ opacity: opacity / 100 }}
    />
  );
}
