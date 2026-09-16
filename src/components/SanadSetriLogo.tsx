import React from 'react';

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';

interface SanadSetriLogoProps {
  size?: LogoSize;
  className?: string;
  useGeneratedAsset?: boolean;
  animated?: boolean;
  withGlow?: boolean;
  showLabel?: boolean;
  label?: string;
}

const sizeMap: Record<LogoSize, { box: string; svgSize: number }> = {
  xs: { box: 'w-5 h-5', svgSize: 20 },
  sm: { box: 'w-7 h-7', svgSize: 28 },
  md: { box: 'w-9 h-9', svgSize: 36 },
  lg: { box: 'w-12 h-12', svgSize: 48 },
  xl: { box: 'w-16 h-16', svgSize: 64 },
  hero: { box: 'w-24 h-24 sm:w-28 sm:h-28', svgSize: 112 },
};

export const SanadSetriLogo: React.FC<SanadSetriLogoProps> = ({
  size = 'md',
  className = '',
  useGeneratedAsset = false,
  animated = true,
  withGlow = true,
  showLabel = false,
  label = 'SANAD',
}) => {
  const { box, svgSize } = sizeMap[size];

  const labelSizeClass = 
    size === 'hero' ? 'text-xs tracking-[0.35em] mt-2' :
    size === 'xl' ? 'text-[10px] tracking-[0.25em] mt-1.5' :
    size === 'lg' ? 'text-[9px] tracking-[0.2em] mt-1' :
    'text-[8px] tracking-[0.18em] mt-0.5';

  const labelNode = showLabel ? (
    <span className={`font-mono font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-amber-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] ${labelSizeClass}`}>
      {label}
    </span>
  ) : null;

  const svgEmblem = (
    <div className={`relative ${box} flex items-center justify-center select-none group ${className}`}>
      {/* Ambient background glow ring */}
      {withGlow && (
        <div 
          className={`absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-indigo-600/20 to-amber-400/20 blur-md transition-opacity group-hover:opacity-100 ${
            animated ? 'animate-pulse' : 'opacity-75'
          }`} 
        />
      )}

      {/* SVG Emblem: Interlocking Sovereign Shield & Pillar */}
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`relative z-10 transition-transform duration-300 ${animated ? 'group-hover:scale-105' : ''}`}
      >
        <defs>
          {/* Cyan-to-Indigo Neural Gradient */}
          <linearGradient id="sanadCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          {/* Sovereign Gold Gradient */}
          <linearGradient id="sanadGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>

          {/* Deep Sovereign Obsidian Backing */}
          <radialGradient id="sanadCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0891b2" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#1e1b4b" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>

          {/* Drop filter */}
          <filter id="sanadShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Ambient Center Glow */}
        <circle cx="50" cy="50" r="42" fill="url(#sanadCoreGlow)" />

        {/* Outer Crystalline Shield (Setri - Protection & Privacy) */}
        <path
          d="M50 8 L86 24 C86 54 72 78 50 92 C28 78 14 54 14 24 L50 8 Z"
          stroke="url(#sanadCyanGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="#020617"
          fillOpacity="0.85"
          filter="url(#sanadShadow)"
        />

        {/* Inner Concentric Hex Diamond */}
        <path
          d="M50 16 L78 29 C78 51 67 69 50 81 C33 69 22 51 22 29 L50 16 Z"
          stroke="url(#sanadGoldGrad)"
          strokeWidth="1.2"
          strokeOpacity="0.6"
          strokeDasharray="3 2"
          fill="none"
        />

        {/* Interlocking 'S' Pillar Nexus (Sanad - Unyielding Support & Intelligence) */}
        <path
          d="M50 24 V76"
          stroke="url(#sanadGoldGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Dynamic Curved 'S' Chevron Arch (Top Swirl) */}
        <path
          d="M34 38 C34 30 42 26 50 26 C58 26 66 30 66 38 C66 46 54 48 50 50"
          stroke="url(#sanadCyanGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Dynamic Curved 'S' Chevron Arch (Bottom Swirl) */}
        <path
          d="M50 50 C46 52 34 54 34 62 C34 70 42 74 50 74 C58 74 66 70 66 62"
          stroke="url(#sanadCyanGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Sovereign Crown Prism Nodes */}
        <circle cx="50" cy="24" r="3.5" fill="#fef08a" />
        <circle cx="50" cy="50" r="3" fill="#22d3ee" />
        <circle cx="50" cy="76" r="3.5" fill="#fbbf24" />

        {/* Left & Right Harmonic Balance Nodes */}
        <circle cx="30" cy="50" r="2" fill="#38bdf8" opacity="0.8" />
        <circle cx="70" cy="50" r="2" fill="#38bdf8" opacity="0.8" />
      </svg>
    </div>
  );

  if (showLabel) {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        {svgEmblem}
        {labelNode}
      </div>
    );
  }

  return svgEmblem;
};

interface SanadSetriBrandProps {
  showSubtitle?: boolean;
  showArabic?: boolean;
  orientation?: 'horizontal' | 'vertical' | 'stacked';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  isArabic?: boolean;
}

export const SanadSetriBrand: React.FC<SanadSetriBrandProps> = ({
  showSubtitle = true,
  showArabic = true,
  orientation = 'horizontal',
  size = 'md',
  className = '',
  isArabic = false,
}) => {
  const isHero = size === 'hero' || size === 'xl';

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col items-center gap-2 select-none ${className}`}>
        <SanadSetriLogo size={size} />
        <div className="flex flex-col items-center text-center">
          <span className="font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-amber-200 font-mono text-sm uppercase">
            S A N A D
          </span>
          <span className="font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300 font-mono text-xs uppercase -mt-0.5">
            S E T R I
          </span>
          {showArabic && (
            <span className="text-[11px] font-bold text-amber-300/90 font-sans tracking-wide mt-1">
              سَنَد سِتْرِي
            </span>
          )}
        </div>
      </div>
    );
  }

  if (orientation === 'stacked' || isHero) {
    return (
      <div className={`flex flex-col items-center text-center gap-3 select-none ${className}`}>
        <SanadSetriLogo size={size} />
        <div className="flex flex-col items-center space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-amber-200 font-sans drop-shadow-sm">
              Sanad setri
            </h1>
          </div>

          {showArabic && (
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-sm sm:text-base font-extrabold text-amber-300 tracking-wider font-sans">
                سَنَد سِتْرِي
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
              <span className="text-xs font-medium text-slate-400">
                الحصن السيادي الموحد
              </span>
            </div>
          )}

          {showSubtitle && (
            <p className="text-xs text-slate-400 max-w-md mx-auto font-medium pt-1">
              {isArabic 
                ? 'محرك البحث والاستقصاء السيادي الموحد • استجابة فورية فائقة الذكاء' 
                : 'Sovereign Unified Intelligence Search Engine • Real-time Instant Cognition'}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Horizontal (Default for Header & Compact bars)
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <SanadSetriLogo size={size} />
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-amber-200 font-sans">
            Sanad setri
          </span>
        </div>
        <div className="flex items-center gap-1.5 -mt-0.5">
          {showArabic && (
            <span className="text-[10px] font-bold text-amber-300 font-sans">
              سَنَد سِتْرِي
            </span>
          )}
          {showArabic && <span className="text-[8px] text-slate-600">•</span>}
          <span className="text-[9px] text-slate-400 font-mono tracking-wider">
            TAHA SETRI ARCHITECTURE
          </span>
        </div>
      </div>
    </div>
  );
};
