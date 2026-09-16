import React, { useEffect, useRef } from 'react';
import { VisionDisplayConfig, BiomeCreatureMode } from '../types';

interface VisionAmbientBiomeProps {
  isArabic: boolean;
  config?: VisionDisplayConfig;
}

interface Ripple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
}

interface KoiFish {
  x: number;
  y: number;
  angle: number;
  targetAngle: number;
  speed: number;
  baseSpeed: number;
  swimCycle: number;
  size: number;
  colorType: 'cyan' | 'gold' | 'coral' | 'violet';
  history: { x: number; y: number }[];
}

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  rotSpeed: number;
  flip: number;
  flipSpeed: number;
  color: string;
  shape: 'sakura' | 'lotus' | 'leaf';
  alpha: number;
}

interface Bubble {
  x: number;
  y: number;
  r: number;
  vy: number;
  alpha: number;
}

export const VisionAmbientBiome: React.FC<VisionAmbientBiomeProps> = ({ isArabic, config }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isEnabled = config ? config.showAmbientBiome && config.biomeMode !== 'none' : true;
  const biomeMode: BiomeCreatureMode = config ? config.biomeMode : 'harmony';
  const pace = config?.biomePace || 'balanced';
  const speedMult = pace === 'calm' ? 0.6 : pace === 'dynamic' ? 1.6 : 1.0;
  const showChromaticLight = config ? config.showChromaticLight : true;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!isEnabled) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Mouse interaction
    let mouseX = -1000;
    let mouseY = -1000;
    const ripples: Ripple[] = [];

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      mouseX = clientX;
      mouseY = clientY;

      // Occasionally add subtle ripple on move
      if (Math.random() < 0.15) {
        ripples.push({
          x: clientX,
          y: clientY,
          r: 2,
          maxR: 35 + Math.random() * 20,
          alpha: 0.35,
        });
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      ripples.push({
        x: clientX,
        y: clientY,
        r: 4,
        maxR: 80,
        alpha: 0.6,
      });
      ripples.push({
        x: clientX,
        y: clientY,
        r: 1,
        maxR: 50,
        alpha: 0.45,
      });
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('touchmove', handlePointerMove);

    // Initialize Koi Fish
    const koiCount = 7;
    const fishColors: ('cyan' | 'gold' | 'coral' | 'violet')[] = [
      'cyan', 'gold', 'coral', 'cyan', 'gold', 'coral', 'violet'
    ];
    const fishList: KoiFish[] = Array.from({ length: koiCount }, (_, idx) => {
      const speed = 1.1 + Math.random() * 0.9;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        angle,
        targetAngle: angle,
        speed,
        baseSpeed: speed,
        swimCycle: Math.random() * Math.PI * 2,
        size: 0.75 + Math.random() * 0.45,
        colorType: fishColors[idx % fishColors.length],
        history: [],
      };
    });

    // Initialize Petals
    const petalColors = [
      '#f472b6', // soft pink
      '#fb7185', // rose
      '#fbcfe8', // sakura blush
      '#e879f9', // violet lotus
      '#fef08a', // pale gold pollen
      '#38bdf8', // cyan dew petal
    ];
    const petalCount = 38;
    const petals: Petal[] = Array.from({ length: petalCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.45) * 0.7,
      vy: 0.45 + Math.random() * 0.65,
      size: 7 + Math.random() * 10,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      flip: Math.random() * Math.PI,
      flipSpeed: 0.02 + Math.random() * 0.03,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      shape: Math.random() > 0.4 ? 'sakura' : Math.random() > 0.5 ? 'lotus' : 'leaf',
      alpha: 0.4 + Math.random() * 0.5,
    }));

    // Floating Bubbles
    const bubbleCount = 20;
    const bubbles: Bubble[] = Array.from({ length: bubbleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.5 + Math.random() * 3,
      vy: 0.3 + Math.random() * 0.7,
      alpha: 0.15 + Math.random() * 0.25,
    }));

    // Ambient Cyber Particles (for pure particle mode)
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.6 ? '#06b6d4' : Math.random() > 0.3 ? '#6366f1' : '#f59e0b',
    }));

    // Dynamic Spectrum Lighting Hue (Continuously shifts across all colors)
    let ambientHue = 190;

    // Helper: Draw Fish
    const drawKoi = (fish: KoiFish) => {
      ctx.save();
      ctx.translate(fish.x, fish.y);
      ctx.rotate(fish.angle);

      const s = fish.size;
      const wave = Math.sin(fish.swimCycle);
      const wave2 = Math.cos(fish.swimCycle);

      let primaryColor = '#06b6d4';
      let secondaryColor = '#38bdf8';
      let glowColor = 'rgba(6, 182, 212, 0.4)';

      if (fish.colorType === 'gold') {
        primaryColor = '#f59e0b';
        secondaryColor = '#fde047';
        glowColor = 'rgba(245, 158, 11, 0.4)';
      } else if (fish.colorType === 'coral') {
        primaryColor = '#f43f5e';
        secondaryColor = '#fb7185';
        glowColor = 'rgba(244, 63, 94, 0.4)';
      } else if (fish.colorType === 'violet') {
        primaryColor = '#a855f7';
        secondaryColor = '#c084fc';
        glowColor = 'rgba(168, 85, 247, 0.4)';
      }

      // Ambient underwater glow beneath fish reflecting ambient lighting
      ctx.shadowBlur = 18 * s;
      ctx.shadowColor = glowColor;

      // Pectoral Fins (left & right fins swaying)
      const finAngleL = -0.6 + wave * 0.25;
      const finAngleR = 0.6 - wave * 0.25;

      // Left fin
      ctx.save();
      ctx.translate(2 * s, -6 * s);
      ctx.rotate(finAngleL);
      ctx.fillStyle = secondaryColor;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.ellipse(0, 0, 10 * s, 4 * s, -0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Right fin
      ctx.save();
      ctx.translate(2 * s, 6 * s);
      ctx.rotate(finAngleR);
      ctx.fillStyle = secondaryColor;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.ellipse(0, 0, 10 * s, 4 * s, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Fish Body (Smooth organic curve)
      ctx.globalAlpha = 0.85;
      const grad = ctx.createLinearGradient(16 * s, 0, -24 * s, 0);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, secondaryColor);
      grad.addColorStop(0.8, primaryColor);
      grad.addColorStop(1, secondaryColor);
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.moveTo(18 * s, 0); // Nose
      // Top side
      ctx.bezierCurveTo(12 * s, -9 * s, -4 * s, -8 * s, -14 * s + wave * 2 * s, -3 * s);
      // Caudal base
      ctx.lineTo(-24 * s + wave * 4 * s, 0);
      // Bottom side
      ctx.bezierCurveTo(-14 * s + wave * 2 * s, 3 * s, -4 * s, 8 * s, 12 * s, 9 * s);
      ctx.closePath();
      ctx.fill();

      // Dorsal Fin ridge (reflects dynamic spectrum lighting)
      ctx.fillStyle = `hsla(${ambientHue}, 90%, 82%, 0.75)`;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.ellipse(2 * s, 0, 7 * s, 1.8 * s, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tail Fin (Two fluttery lobes)
      ctx.save();
      ctx.translate(-24 * s + wave * 4 * s, 0);
      ctx.rotate(wave * 0.45);
      ctx.globalAlpha = 0.65;
      ctx.fillStyle = secondaryColor;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-8 * s, -10 * s, -16 * s, -12 * s, -18 * s + wave2 * 3 * s, -7 * s);
      ctx.bezierCurveTo(-12 * s, -2 * s, -12 * s, 2 * s, -18 * s + wave2 * 3 * s, 7 * s);
      ctx.bezierCurveTo(-16 * s, 12 * s, -8 * s, 10 * s, 0, 0);
      ctx.fill();
      ctx.restore();

      // Eyes (Cute glowing dots)
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.arc(13 * s, -4 * s, 1.3 * s, 0, Math.PI * 2);
      ctx.arc(13 * s, 4 * s, 1.3 * s, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Helper: Draw Petal / Blossom
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      // 3D Flip perspective scaling
      const flipScale = Math.cos(p.flip);
      ctx.scale(1, flipScale);

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * Math.max(0.2, Math.abs(flipScale));
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;

      if (p.shape === 'sakura') {
        // Classic Sakura petal with notched tip
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.9, p.size * 0.4, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.4, -p.size * 0.8, -p.size * 0.6, 0, -p.size);
        ctx.fill();

        // Inner petal vein
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.6);
        ctx.lineTo(0, p.size * 0.7);
        ctx.stroke();
      } else if (p.shape === 'lotus') {
        // Lotus petal curve
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.1);
        ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.3, p.size * 0.6, p.size * 0.5, 0, p.size * 0.9);
        ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.5, -p.size * 0.6, -p.size * 0.3, 0, -p.size * 1.1);
        ctx.fill();
      } else {
        // Soft water leaf
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.9, p.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    // Main Simulation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Advance Dynamic Spectrum Lighting Hue across all colors
      ambientHue = (ambientHue + 0.35 * speedMult) % 360;

      // 0. Dynamic Spectrum Ambient Light Washes (Living Light cycling through all colors)
      if (showChromaticLight) {
        ctx.save();
        // Primary orbital chromatic light pool
        const cx1 = width * 0.5 + Math.sin(ambientHue * 0.02) * (width * 0.28);
        const cy1 = height * 0.45 + Math.cos(ambientHue * 0.025) * (height * 0.22);
        const rad1 = Math.max(width, height) * 0.65;
        const grad1 = ctx.createRadialGradient(cx1, cy1, 10, cx1, cy1, rad1);
        grad1.addColorStop(0, `hsla(${ambientHue}, 90%, 55%, 0.17)`);
        grad1.addColorStop(0.35, `hsla(${(ambientHue + 50) % 360}, 85%, 48%, 0.08)`);
        grad1.addColorStop(0.7, `hsla(${(ambientHue + 100) % 360}, 80%, 40%, 0.02)`);
        grad1.addColorStop(1, 'transparent');
        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, width, height);

        // Counter-harmonic orbital chromatic light pool
        const cx2 = width * 0.5 - Math.cos(ambientHue * 0.018) * (width * 0.26);
        const cy2 = height * 0.55 - Math.sin(ambientHue * 0.022) * (height * 0.2);
        const rad2 = Math.max(width, height) * 0.55;
        const grad2 = ctx.createRadialGradient(cx2, cy2, 5, cx2, cy2, rad2);
        grad2.addColorStop(0, `hsla(${(ambientHue + 150) % 360}, 85%, 52%, 0.12)`);
        grad2.addColorStop(0.45, `hsla(${(ambientHue + 210) % 360}, 80%, 45%, 0.04)`);
        grad2.addColorStop(1, 'transparent');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // 1. Water Ripples (with dynamic spectral illumination)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.r += 1.2;
        r.alpha -= 0.008;

        if (r.alpha <= 0 || r.r >= r.maxR) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${ambientHue}, 95%, 65%, ${r.alpha * 0.75})`;
        ctx.globalAlpha = r.alpha * 0.6;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = `hsl(${ambientHue}, 90%, 55%)`;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Rising Bubbles (if fish or harmony mode)
      if (biomeMode === 'koi' || biomeMode === 'harmony') {
        for (const b of bubbles) {
          b.y -= b.vy;
          b.x += Math.sin(b.y * 0.02) * 0.3;
          if (b.y < -10) {
            b.y = height + 10;
            b.x = Math.random() * width;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${ambientHue}, 80%, 80%, ${b.alpha * 0.9})`;
          ctx.fillStyle = `hsla(${ambientHue}, 90%, 90%, 0.08)`;
          ctx.globalAlpha = b.alpha;
          ctx.lineWidth = 1;
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
      }

      // 3. Koi Fish Simulation
      if (biomeMode === 'koi' || biomeMode === 'harmony') {
        for (const fish of fishList) {
          // Autonomous smooth wandering
          if (Math.random() < 0.02) {
            fish.targetAngle += (Math.random() - 0.5) * 1.5;
          }

          // React gently to mouse: fish either swim towards curser gently or turn around
          const dxMouse = mouseX - fish.x;
          const dyMouse = mouseY - fish.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          if (distMouse < 180 && distMouse > 15) {
            // Curious turn or gentle divert
            const angleToMouse = Math.atan2(dyMouse, dxMouse);
            fish.targetAngle = angleToMouse + 0.3;
            fish.speed = fish.baseSpeed * 1.4;
          } else {
            fish.speed = fish.baseSpeed;
          }

          // Smooth turn interpolation
          let angleDiff = fish.targetAngle - fish.angle;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          fish.angle += angleDiff * 0.04;

          // Swim movement
          fish.x += Math.cos(fish.angle) * fish.speed;
          fish.y += Math.sin(fish.angle) * fish.speed;
          fish.swimCycle += 0.12 * fish.speed;

          // Screen boundaries: steer smoothly back into screen
          const margin = 80;
          if (fish.x < margin) fish.targetAngle = 0;
          if (fish.x > width - margin) fish.targetAngle = Math.PI;
          if (fish.y < margin) fish.targetAngle = Math.PI / 2;
          if (fish.y > height - margin) fish.targetAngle = -Math.PI / 2;

          drawKoi(fish);
        }
      }

      // 4. Flowers and Petals Floating Simulation
      if (biomeMode === 'flowers' || biomeMode === 'harmony') {
        for (const p of petals) {
          p.x += p.vx + Math.sin(p.y * 0.015) * 0.6;
          p.y += p.vy;
          p.rot += p.rotSpeed;
          p.flip += p.flipSpeed;

          // React softly to cursor breeze
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const push = (1 - dist / 120) * 1.2;
            p.x -= (dx / dist) * push;
            p.y -= (dy / dist) * push;
          }

          // Wrap around edges
          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;

          drawPetal(p);
        }
      }

      // 5. Digital Cyber Particles (particles mode)
      if (biomeMode === 'particles') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = '#38bdf8';
              ctx.globalAlpha = (1 - dist / 120) * 0.15;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animId);
    };
  }, [isEnabled, biomeMode, pace, showChromaticLight]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

