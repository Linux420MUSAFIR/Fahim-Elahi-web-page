import React from 'react';
import { ArrowUpRight, Award, Camera, Film, Layers, Sparkles } from 'lucide-react';

interface AboutSectionProps {
  onOpenProfile: () => void;
  onOpenContact: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenProfile, onOpenContact }) => {
  const clients = [
    'Gumi bhai studio',
    'aqil studio',
    'musafir bhai',
    'NSU as volunteer',
    'BDgp',
    'HS studio'
  ];

  return (
    <section
      id="about"
      className="relative bg-[#0A0A0A] text-white py-24 lg:py-32 overflow-hidden border-t border-[#262626]"
    >
      {/* Background Repeating Horizontal Marquee Ticker ("about . about . about .") */}
      <div
        className="absolute top-12 left-0 right-0 overflow-hidden pointer-events-none opacity-10 select-none z-0"
        aria-hidden="true"
      >
        <div className="animate-marquee whitespace-nowrap flex text-white font-display font-extrabold text-7xl sm:text-9xl tracking-tighter lowercase">
          <span>about . about . about . about . about . about . about . about . &nbsp;</span>
          <span>about . about . about . about . about . about . about . about . &nbsp;</span>
        </div>
      </div>

      <div
        className="absolute bottom-10 left-0 right-0 overflow-hidden pointer-events-none opacity-5 select-none z-0"
        aria-hidden="true"
      >
        <div className="animate-marquee-reverse whitespace-nowrap flex text-white font-display font-extrabold text-6xl sm:text-8xl tracking-tighter lowercase">
          <span>cinematography . scenography . chiaroscuro . spatial light . &nbsp;</span>
          <span>cinematography . scenography . chiaroscuro . spatial light . &nbsp;</span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header Tag */}
        <div className="flex items-center justify-between mb-16 pb-4 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5AC27]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#999999]">
              02 // philosophy & direction
            </span>
          </div>
          <span className="text-xs font-mono text-[#666666]">
            est. 2024 // direction & cinematography
          </span>
        </div>

        {/* Core Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left / Center Visual: Cutout Portrait Surrounded by Radial Layered Badge Effect */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 sm:w-88 md:w-96 aspect-square flex items-center justify-center">
              {/* Radial Layer 1: Outermost Subtle Orbit Ring with Degree Markers */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[#F5AC27]/30 animate-spin-slow" />

              {/* Radial Layer 2: Middle Fine Geometric Ring */}
              <div className="absolute inset-5 rounded-full border border-white/10" />

              {/* Radial Layer 3: Golden Accent Ring with Subtle Glow */}
              <div className="absolute inset-10 rounded-full border border-[#F5AC27]/40 shadow-[0_0_30px_rgba(245,172,39,0.15)]" />

              {/* Radial Layer 4: Layered Orbital Cardinal Dots */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#F5AC27]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-[#F5AC27]" />
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/60" />
              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/60" />

              {/* Rotating Circular Stamp Badge Overlay */}
              <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full bg-[#F5AC27] text-[#0A0A0A] p-2 flex items-center justify-center shadow-lg animate-spin-slow z-20">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <path
                    id="textPath-stamp"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                  <text className="text-[9px] font-mono uppercase tracking-[0.18em] fill-current font-bold">
                    <textPath href="#textPath-stamp">
                      • FAHIM A ELAHI • 3D ARTIST • ANIMATOR •
                    </textPath>
                  </text>
                </svg>
                <div className="absolute w-6 h-6 rounded-full bg-[#0A0A0A] text-[#F5AC27] flex items-center justify-center text-xs font-bold">
                  ✦
                </div>
              </div>

              {/* Cutout Portrait Mask in Center */}
              <div className="relative w-56 sm:w-68 md:w-76 aspect-square rounded-full overflow-hidden border-2 border-[#F5AC27]/40 bg-gradient-to-b from-[#1c1c1c] to-[#0A0A0A] shadow-2xl z-10 group">
                <img
                  src="/artist-portrait.webp"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://i.postimg.cc/kqbsrNxp/618916404-17980511894955027-8654882307766037556-n.webp';
                  }}
                  alt="Fahim A Elahi - 3D Artist, Animator & Filmmaker"
                  className="w-full h-full object-cover object-center filter contrast-105 brightness-100 hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {/* Subtle dark vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Artist Status Pill */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 bg-[#0A0A0A]/95 border border-[#F5AC27]/50 text-white px-4 py-1.5 rounded-full text-xs font-mono flex items-center gap-2 shadow-lg backdrop-blur-md whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-[#F5AC27] animate-pulse" />
                <span>3D artist & filmmaker // fahim a elahi</span>
              </div>
            </div>
          </div>

          {/* Right Column: Statement, Disciplines, and Client Ledger */}
          <div className="lg:col-span-7 flex flex-col">
            <h2 className="font-orange-vintage font-normal text-3xl sm:text-4xl lg:text-5xl tracking-normal leading-[1.2] mb-6 text-white">
              "Cinema is not what we see, but what we feel."
            </h2>

            <div className="space-y-4 text-zinc-300 text-base sm:text-lg font-normal leading-relaxed mb-8">
              <p>
                I’m Fahim A. Elahi, a 3D artist, animator, and aspiring filmmaker. I’m interested in creating characters, building worlds, and telling stories through visuals. Most of my work comes from experimenting with 3D, animation, cinematography, and different ways of bringing an idea to life.
              </p>
              <p>
                For me, the goal isn’t just to make something look good. I want my work to have a feeling behind it—something that makes people stop, look, and maybe remember it. I’m still learning, experimenting, and developing my own style, but I’m working toward becoming a filmmaker and director who can create stories and worlds that feel personal and memorable.
              </p>
            </div>

            {/* Core Pillars / Disciplines */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="bg-[#141414] p-4.5 rounded-xl border border-white/5 flex flex-col justify-start">
                <Camera className="w-5 h-5 text-[#F5AC27] mb-2.5" />
                <h3 className="font-display font-bold text-base text-white mb-1.5">
                  Cinematography
                </h3>
                <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                  My vision. My frame. My story.
                </p>
              </div>

              <div className="bg-[#141414] p-4.5 rounded-xl border border-white/5 flex flex-col justify-start">
                <Layers className="w-5 h-5 text-[#F5AC27] mb-2.5" />
                <h3 className="font-display font-bold text-base text-white mb-1.5">
                  Animation
                </h3>
                <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                  We don’t animate objects, we animate emotions.
                </p>
              </div>

              <div className="bg-[#141414] p-4.5 rounded-xl border border-white/5 flex flex-col justify-start">
                <Film className="w-5 h-5 text-[#F5AC27] mb-2.5" />
                <h3 className="font-display font-bold text-base text-white mb-1.5">
                  Director
                </h3>
                <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                  I don’t just tell stories. I create experiences.
                </p>
              </div>
            </div>

            {/* Client Roster Pill Grid */}
            <div className="pt-6 border-t border-[#262626]">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-sm sm:text-base font-mono font-bold uppercase tracking-wider text-white border-b-2 border-[#F5AC27] pb-1 inline-block">
                  voluntary & internship
                </span>
                <span className="w-12 h-px bg-[#F5AC27]/40" />
              </div>
              <div className="flex flex-wrap gap-2">
                {clients.map((client) => (
                  <span
                    key={client}
                    className="px-3 py-1 rounded-full bg-[#181818] hover:bg-[#F5AC27] hover:text-[#0A0A0A] text-zinc-300 text-xs font-mono transition-colors duration-200 border border-white/5 cursor-default"
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <button
                id="about-open-profile"
                onClick={onOpenProfile}
                className="inline-flex items-center gap-2 bg-[#F5AC27] hover:bg-[#E09817] text-[#0A0A0A] font-mono text-xs uppercase tracking-wider font-semibold px-5 py-3 rounded-full transition-all cursor-pointer shadow-md"
              >
                <span>view full dossier & gear specs</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                id="about-open-contact"
                onClick={onOpenContact}
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white text-white font-mono text-xs uppercase tracking-wider px-5 py-3 rounded-full transition-all cursor-pointer"
              >
                <span>inquire availability</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
