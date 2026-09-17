import React from 'react';
import { X, Sparkles, MapPin, Mail, ExternalLink, Camera, Film, Award, CheckCircle2 } from 'lucide-react';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose, onOpenContact }) => {
  if (!isOpen) return null;

  return (
    <div
      id="profile-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-[#0A0A0A]/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="profile-drawer-panel"
        className="w-full max-w-lg bg-[#0A0A0A] border-l border-[#262626] h-full overflow-y-auto text-white p-6 sm:p-8 flex flex-col justify-between animate-in slide-in-from-right duration-300 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#262626] mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F5AC27]" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                director's credentials // 2026
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Card */}
          <div className="flex items-start gap-4 mb-6">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#F5AC27] shrink-0 bg-black shadow-lg">
              <img
                src="/artist-portrait.webp"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://i.postimg.cc/kqbsrNxp/618916404-17980511894955027-8654882307766037556-n.webp';
                }}
                alt="Fahim A Elahi"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[10px] font-mono uppercase mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available</span>
              </div>
              <h3 className="font-display font-black text-2xl lowercase text-white">
                fahim a elahi
              </h3>
              <p className="text-xs font-mono text-[#F5AC27]">
                3D Artist | 3D Animator | Filmmaker
              </p>
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-3 mb-6 text-sm text-zinc-300 font-normal leading-relaxed">
            <p>
              I’m Fahim A. Elahi, a 3D artist, animator, and aspiring filmmaker. I’m interested in creating characters, building worlds, and telling stories through visuals. Most of my work comes from experimenting with 3D, animation, cinematography, and different ways of bringing an idea to life.
            </p>
            <p>
              For me, the goal isn’t just to make something look good. I want my work to have a feeling behind it—something that makes people stop, look, and maybe remember it. I’m still learning, experimenting, and developing my own style, but I’m working toward becoming a filmmaker and director who can create stories and worlds that feel personal and memorable.
            </p>
          </div>

          {/* Director & Core Skills */}
          <div className="p-4 rounded-xl bg-[#141414] border border-white/5 space-y-3 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#F5AC27]">
              <Film className="w-3.5 h-3.5" />
              <span>Director</span>
            </div>

            <ul className="text-xs font-mono text-zinc-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5AC27] shrink-0" />
                <span>Character Animation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5AC27] shrink-0" />
                <span>Visual Storytelling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5AC27] shrink-0" />
                <span>3D Artist</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5AC27] shrink-0" />
                <span>Motion & Movement Animator</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5AC27] shrink-0" />
                <span>Filmmaking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5AC27] shrink-0" />
                <span>Creative Development</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F5AC27] shrink-0" />
                <span>ANIMATION</span>
              </li>
            </ul>
          </div>

          {/* Representation & Locations */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 rounded-lg bg-[#141414] border border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Dhaka // Uttara</span>
              <span className="text-xs font-mono text-white block font-medium">Uttara & Hazi Camp</span>
              <span className="text-[11px] font-mono text-[#F5AC27]">fahimelahi70@gmail.com</span>
            </div>

            <div className="p-3 rounded-lg bg-[#141414] border border-white/5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Dhanmondi</span>
              <span className="text-xs font-mono text-white block font-medium">Dhaka, Bangladesh</span>
              <span className="text-[11px] font-mono text-[#F5AC27]">fahimelahi70@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Action Bottom */}
        <div className="pt-6 border-t border-[#262626] space-y-3">
          <button
            onClick={() => {
              onClose();
              onOpenContact();
            }}
            className="w-full py-3.5 rounded-full bg-[#F5AC27] hover:bg-[#E09817] text-[#0A0A0A] font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer text-center shadow-lg"
          >
            initiate private inquiry / commission
          </button>

          <div className="flex items-center justify-center text-xs font-mono text-zinc-400 px-2">
            <a
              href="https://www.instagram.com/musafir_bhai420?stkn=MTFraGNtYzFpZDQyMg=="
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#F5AC27] transition-colors flex items-center gap-1.5"
            >
              <span>instagram @musafir_bhai420</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
