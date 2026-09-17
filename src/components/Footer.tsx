import React from 'react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenProfile: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenProfile, onOpenContact }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'home', href: '#home' },
    { label: 'about', href: '#about' },
    { label: 'portfolio', href: '#portfolio' },
    { label: 'craft', href: '#craft' },
    { label: 'contact', href: '#contact' },
  ];

  const socialLinks = [
    {
      label: 'instagram',
      href: 'https://www.instagram.com/musafir_bhai420?stkn=MTFraGNtYzFpZDQyMg=='
    },
  ];

  return (
    <footer className="relative bg-[#0A0A0A] text-white pt-20 pb-12 border-t border-[#262626] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Top bar: Inquiries and Back to top */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-12 border-b border-[#262626]">
          <div className="flex flex-col">
            <span className="text-xs font-mono uppercase tracking-widest text-[#F5AC27] mb-1">
              fahim a elahi [ musafir ] // director
            </span>
            <span className="font-display text-lg text-white font-bold lowercase">
              seeking exceptional visions for screen & physical space.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenContact}
              className="bg-[#F5AC27] hover:bg-[#E09817] text-[#0A0A0A] px-5 py-2.5 rounded-full text-xs font-mono uppercase font-bold tracking-wider transition-colors cursor-pointer"
            >
              start a project
            </button>

            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full border border-white/20 hover:border-white text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Return to Top"
              aria-label="Return to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Inline Navigation Mirroring the Header */}
        <div className="py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-[#262626]">
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-mono lowercase text-zinc-400 hover:text-[#F5AC27] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Media Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono lowercase text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>{social.label}</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-500" />
              </a>
            ))}
          </div>
        </div>

        {/* Massive Display Text: "musafir" */}
        <div className="py-12 sm:py-16 overflow-hidden select-none">
          <h2 className="font-display font-extrabold text-[18vw] sm:text-[17vw] lg:text-[16vw] text-white/90 tracking-tighter leading-none lowercase text-center hover:text-[#F5AC27] transition-colors duration-700 cursor-default">
            musafir
          </h2>
        </div>

        {/* Bottom Copyright and Meta Bar */}
        <div className="pt-8 border-t border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            © 2024 Fahim A Elahi [ musafir ]. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenProfile}
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Director Dossier
            </button>
            <span className="text-zinc-700">•</span>
            <span>Dhaka // Uttara // Dhanmondi // Hazi Camp</span>
            <span className="text-zinc-700">•</span>
            <span className="text-[#F5AC27]">35mm Analog Archive</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
