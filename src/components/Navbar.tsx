import React, { useState } from 'react';

export const Navbar: React.FC<{
  onOpenProfile?: () => void;
  onOpenContact?: () => void;
}> = ({ onOpenProfile, onOpenContact }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scroll when mobile overlay is active
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenContact) {
      onOpenContact();
    } else {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* NAVBAR: Ultra-compact, slim & crystal clear (video character head completely unblocked) */}
      <header
        id="mainframe-navbar"
        className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 py-1.5 sm:py-2 flex justify-between items-center select-none bg-white/20 hover:bg-white/60 backdrop-blur-xs transition-all duration-300 border-b border-black/5"
      >
        {/* Logo (left): "Fahim A Elahi" with "[ musafir ] • 2024" */}
        <a
          href="#home"
          className="flex flex-col no-underline focus:outline-hidden text-black group"
        >
          <span
            className="text-[15px] sm:text-[17px] tracking-tight text-black font-extrabold font-display leading-tight"
          >
            Fahim A Elahi
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono text-black/60 tracking-wider">
            [ musafir ] &bull; 2024
          </span>
        </a>

        {/* Center Pill Nav: Super-compact slim height */}
        <nav
          id="desktop-nav"
          className="hidden md:flex items-center gap-4 lg:gap-5 bg-white/80 border border-black/10 rounded-full px-4 py-1 shadow-xs backdrop-blur-xs text-[11px] font-mono lowercase text-black/80"
        >
          <a href="#home" className="hover:text-black hover:font-bold transition-all">
            home
          </a>
          <a href="#about" className="hover:text-black hover:font-bold transition-all">
            about
          </a>
          <a href="#portfolio" className="hover:text-black hover:font-bold transition-all">
            portfolio
          </a>
          <a href="#craft" className="hover:text-black hover:font-bold transition-all">
            craft
          </a>
          <a href="#contact" className="hover:text-black hover:font-bold transition-all">
            contact
          </a>
        </nav>

        {/* Right Action Controls: Slim buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenProfile}
            className="inline-flex items-center gap-1.5 bg-[#0A0A0A] text-white rounded-full px-2.5 py-1 text-[11px] font-mono font-medium hover:bg-neutral-800 transition-all cursor-pointer shadow-xs"
          >
            <span className="w-4 h-4 rounded-full bg-neutral-700 overflow-hidden inline-flex items-center justify-center text-[9px]">
              🧑‍💻
            </span>
            <span>artist dossier</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5AC27]" />
          </button>

          <button
            type="button"
            onClick={handleContactClick}
            className="inline-flex items-center gap-1 bg-white text-black border border-black/80 rounded-full px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all cursor-pointer shadow-xs"
          >
            <span>INQUIRE</span>
            <span className="text-[10px] leading-none">&#x2197;</span>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle mobile menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-7 h-7 gap-[4px] focus:outline-hidden z-50 cursor-pointer"
        >
          <span
            className={`w-5 h-[2px] bg-black transition-all duration-300 transform ${
              mobileMenuOpen ? 'rotate-45 translate-y-[6px]' : ''
            }`}
          />
          <span
            className={`w-5 h-[2px] bg-black transition-all duration-300 ${
              mobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-5 h-[2px] bg-black transition-all duration-300 transform ${
              mobileMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''
            }`}
          />
        </button>
      </header>

      {/* Mobile overlay */}
      <div
        id="mobile-overlay"
        className={`fixed inset-0 z-45 bg-white/95 backdrop-blur-sm flex flex-col justify-center items-start px-8 gap-6 md:hidden transition-all duration-300 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <a
          href="#home"
          onClick={() => setMobileMenuOpen(false)}
          className="text-[22px] font-medium text-black font-display hover:opacity-60 transition-opacity"
        >
          home
        </a>
        <a
          href="#about"
          onClick={() => setMobileMenuOpen(false)}
          className="text-[22px] font-medium text-black font-display hover:opacity-60 transition-opacity"
        >
          about
        </a>
        <a
          href="#portfolio"
          onClick={() => setMobileMenuOpen(false)}
          className="text-[22px] font-medium text-black font-display hover:opacity-60 transition-opacity"
        >
          portfolio
        </a>
        <a
          href="#craft"
          onClick={() => setMobileMenuOpen(false)}
          className="text-[22px] font-medium text-black font-display hover:opacity-60 transition-opacity"
        >
          craft
        </a>
        <a
          href="#contact"
          onClick={() => setMobileMenuOpen(false)}
          className="text-[22px] font-medium text-black font-display hover:opacity-60 transition-opacity"
        >
          contact
        </a>

        <div className="pt-4 flex flex-col gap-3 w-full">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenProfile) onOpenProfile();
            }}
            className="inline-flex items-center justify-center gap-2 bg-[#0A0A0A] text-white rounded-full px-4 py-2 text-[13px] font-mono"
          >
            <span>artist dossier</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5AC27]" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleContactClick(e);
            }}
            className="inline-flex items-center justify-center gap-1 bg-black text-white rounded-full px-4 py-2 text-[13px] font-mono font-bold uppercase"
          >
            <span>INQUIRE &#x2197;</span>
          </button>
        </div>
      </div>
    </>
  );
};
