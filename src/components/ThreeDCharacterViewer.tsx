import React, { useRef, useState } from 'react';

export const ThreeDCharacterViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Interactive 3D parallax on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -(y / (rect.height / 2)) * 10,
      y: (x / (rect.width / 2)) * 12
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-md h-[440px] sm:h-[480px] lg:h-[520px] flex items-center justify-center select-none"
      style={{ perspective: '1000px' }}
    >
      {/* Background Soft Ambient Light Ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 rounded-full bg-gradient-to-tr from-[#F5AC27]/20 via-[#F5AC27]/10 to-transparent filter blur-3xl" />
        <div className="w-64 h-64 rounded-full border border-[#F5AC27]/20 animate-spin-slow opacity-40" />
      </div>

      {/* 3D Character Stage Card with Parallax Tilt */}
      <div
        className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-[#E5E5E5] bg-[#0A0A0A] transition-transform duration-200 ease-out flex flex-col justify-end p-6"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Rendered 3D Character Model Aesthetic Image from user's Cloudinary asset */}
        <img
          src="https://res.cloudinary.com/v3pwznsb/image/upload/v1789573460/WhatsApp_Image_2026-09-16_at_7.59.03_AM_1.jpg"
          alt="3D Character Model - The Cyber Sentinel"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-contain object-center filter contrast-105 transition-transform duration-700 hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Cinematic atmospheric depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/30 pointer-events-none" />

        {/* Top 3D Viewport status badge */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#F5AC27]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5AC27] animate-pulse" />
            <span>3D CHARACTER LOOKDEV</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/5">
            ZBRUSH // MAYA // 8K UDIM
          </span>
        </div>

        {/* Bottom Interactive Spec Info */}
        <div className="relative z-10 space-y-1.5 pointer-events-none">
          <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
            <span>FIGURE MODEL #01</span>
            <span className="text-[#F5AC27]">//</span>
            <span>HIGH-POLY SCULPT</span>
          </div>
          <h4 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight">
            The Cyber Sentinel
          </h4>
          <p className="text-xs text-zinc-300 font-sans line-clamp-2">
            Anatomical digital look-development featuring tactile micro-displacement, mechanical joints, and ACES cinematic shader.
          </p>
        </div>
      </div>
    </div>
  );
};
