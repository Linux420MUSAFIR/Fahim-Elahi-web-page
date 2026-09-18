import React, { useRef, useEffect, useState } from 'react';
import { Compass } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = videoContainerRef.current;
    if (!video || !container) return;

    // Respect user motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Center resting progress (0.5 = character looks straight ahead)
    let targetProgress = 0.5;
    let targetProgressY = 0.5;
    let currentProgress = 0.5;
    let currentProgressY = 0.5;

    let animId: number | null = null;
    let isSeeking = false;
    let pendingTime: number | null = null;
    let seekTimeoutId: number | null = null;
    let isHeroInView = true;
    let isInteracting = false;
    let idleTimerId: number | null = null;
    let idleStartTime = Date.now();

    // Cache viewport dimensions
    let cachedWidth = window.innerWidth || 1;
    let cachedHeight = window.innerHeight || 1;

    const onResize = () => {
      cachedWidth = window.innerWidth || 1;
      cachedHeight = window.innerHeight || 1;
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Mark interaction and schedule idle return
    const recordInteraction = () => {
      isInteracting = true;
      if (idleTimerId !== null) {
        window.clearTimeout(idleTimerId);
      }
      idleTimerId = window.setTimeout(() => {
        isInteracting = false;
        idleStartTime = Date.now();
      }, 2500);
    };

    // Direct cursor tracking:
    // Left (normX ~ 0.0) -> video start frame (looks left)
    // Center (normX ~ 0.5) -> video center frame (looks straight)
    // Right (normX ~ 1.0) -> video end frame (looks right)
    const updatePointer = (clientX: number, clientY: number) => {
      if (!isHeroInView || prefersReducedMotion) return;
      recordInteraction();

      const normX = Math.max(0, Math.min(clientX / cachedWidth, 1));
      const normY = Math.max(0, Math.min(clientY / cachedHeight, 1));

      targetProgress = Math.max(0.01, Math.min(0.99, normX));
      targetProgressY = Math.max(0.01, Math.min(0.99, normY));
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePointer(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // High-performance, non-blocking seek pipeline
    const onSeekDone = () => {
      if (seekTimeoutId !== null) {
        window.clearTimeout(seekTimeoutId);
        seekTimeoutId = null;
      }
      isSeeking = false;

      // If a newer frame position arrived while previous frame was decoding, seek to it immediately
      if (pendingTime !== null && video && video.duration) {
        const next = pendingTime;
        pendingTime = null;
        if (Math.abs(next - video.currentTime) > 0.018) {
          executeSeek(next);
        }
      }
    };

    const executeSeek = (time: number) => {
      if (!video || !video.duration || isNaN(time)) return;
      const clamped = Math.max(0.01, Math.min(time, video.duration - 0.01));

      if (isSeeking) {
        pendingTime = clamped;
        return;
      }

      isSeeking = true;
      video.currentTime = clamped;

      // Sync with modern browser video compositor if supported
      if ('requestVideoFrameCallback' in video) {
        try {
          (video as any).requestVideoFrameCallback(() => {
            onSeekDone();
          });
        } catch {
          // Fallback to seeked event
        }
      }

      // Safety timeout: prevents seek queue from ever stalling
      if (seekTimeoutId !== null) window.clearTimeout(seekTimeoutId);
      seekTimeoutId = window.setTimeout(onSeekDone, 40);
    };

    video.addEventListener('seeked', onSeekDone);

    // Initial setup when video metadata loads
    const onLoadedMetadata = () => {
      video.pause();
      if (video.duration && !isNaN(video.duration)) {
        // Center frame: looking straight forward
        const centerTime = 0.5 * video.duration;
        executeSeek(centerTime);
      }
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    if (video.readyState >= 1 && video.duration) {
      onLoadedMetadata();
    }

    // IntersectionObserver to pause loop when scrolled out of view
    const observer = new IntersectionObserver(
      (entries) => {
        isHeroInView = entries[0].isIntersecting;
        if (!isHeroInView) {
          if (animId !== null) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        } else if (animId === null && !prefersReducedMotion) {
          animId = requestAnimationFrame(renderLoop);
        }
      },
      { threshold: 0.05 }
    );

    const sectionEl = document.getElementById('home');
    if (sectionEl) {
      observer.observe(sectionEl);
    }

    // 60-120 FPS buttery-smooth spring damping render loop
    const renderLoop = () => {
      if (!isHeroInView) return;

      // Gentle ambient breathing idle motion when user isn't actively moving
      if (!isInteracting && !prefersReducedMotion) {
        const elapsed = (Date.now() - idleStartTime) * 0.001;
        // Subtle ambient look around center (±0.06 amplitude)
        targetProgress = 0.5 + Math.sin(elapsed * 0.8) * 0.06;
        targetProgressY = 0.5 + Math.cos(elapsed * 0.6) * 0.04;
      }

      const diffX = targetProgress - currentProgress;
      const diffY = targetProgressY - currentProgressY;

      // Silky organic exponential lerp (0.08 damping factor)
      currentProgress += diffX * 0.08;
      currentProgressY += diffY * 0.08;

      // 1. Hardware accelerated 3D tilt & parallax (runs at display refresh rate on GPU)
      const rotY = (currentProgress - 0.5) * 14;   // -7deg to +7deg
      const rotX = -(currentProgressY - 0.5) * 8;  // -4deg to +4deg
      const transX = (currentProgress - 0.5) * 32; // -16px to +16px
      const transY = (currentProgressY - 0.5) * 18;

      container.style.transform = `perspective(1200px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) translate3d(${transX.toFixed(2)}px, ${transY.toFixed(2)}px, 0) scale(1.03)`;

      // 2. Video frame scrub tracking (matches cursor position at full 1080p native quality)
      if (video && video.duration && !isNaN(video.duration)) {
        if (!video.paused) {
          video.pause();
        }
        const desiredTime = currentProgress * video.duration;
        if (Math.abs(desiredTime - video.currentTime) > 0.02) {
          executeSeek(desiredTime);
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    if (!prefersReducedMotion) {
      animId = requestAnimationFrame(renderLoop);
    }

    return () => {
      if (animId !== null) cancelAnimationFrame(animId);
      if (seekTimeoutId !== null) window.clearTimeout(seekTimeoutId);
      if (idleTimerId !== null) window.clearTimeout(idleTimerId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      video.removeEventListener('seeked', onSeekDone);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative w-full min-h-[100dvh] flex flex-col justify-end md:justify-center items-start px-5 sm:px-10 md:px-16 lg:px-20 overflow-hidden select-none pt-24 pb-12 sm:pb-16 md:py-0"
    >
      {/* 
        ORIGINAL HIGH-DEFINITION 1080P 3D CHARACTER ANIMATION
        Scrubbed seamlessly with cursor movement at full native quality
      */}
      <div
        ref={videoContainerRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0 will-change-transform bg-[#F9F7F4]"
        style={{
          transform: 'perspective(1200px) rotateY(0deg) rotateX(0deg) translate3d(0px, 0px, 0) scale(1.03)',
        }}
      >
        {!videoLoaded && (
          <img
            src="/hero-poster.webp"
            alt="Fahim A Elahi Character"
            className="absolute inset-0 w-full h-full object-cover object-[78%_center] md:object-[78%_center] pointer-events-none select-none"
          />
        )}
        <video
          ref={videoRef}
          src="/character-anim.mp4"
          poster="/hero-poster.webp"
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover object-[78%_center] md:object-[78%_center] select-none transition-opacity duration-500 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* 
        ARCHITECTURAL GRID OVERLAY
      */}
      <div
        className="absolute inset-0 z-1 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.07) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.07) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* 
        HERO SECTION CONTENT & TYPOGRAPHY
      */}
      <div className="relative z-10 w-full max-w-xl lg:max-w-2xl text-left flex flex-col items-start">
        
        {/* Giant Main Display Heading: "Fahim A Elahi" */}
        <h1
          className="font-display font-extrabold text-black tracking-tight leading-none mb-4 sm:mb-5 select-none whitespace-nowrap"
          style={{
            fontSize: 'clamp(28px, 4.8vw, 58px)',
            letterSpacing: '-0.04em',
          }}
        >
          Fahim A Elahi
        </h1>

        {/* Pill Badge: "• 3D ARTIST | 3D ANIMATOR | FILMMAKER" */}
        <div className="inline-flex items-center gap-2 bg-[#FEE4A3]/85 border border-[#F5AC27]/50 rounded-full px-3.5 sm:px-4 py-1.5 mb-4 sm:mb-5 shadow-xs backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-[#E09015] inline-block animate-pulse" />
          <span className="text-[11px] sm:text-[12.5px] font-mono font-bold tracking-wider text-[#2A2109] uppercase">
            3D ARTIST &nbsp;|&nbsp; 3D ANIMATOR &nbsp;|&nbsp; FILMMAKER
          </span>
        </div>

        {/* Bio Paragraph: 2 Sentences */}
        <div className="max-w-xl text-neutral-950 font-sans font-medium text-[16.5px] sm:text-[18px] md:text-[19px] leading-[1.65] tracking-[-0.015em] mb-4">
          <p>
            I am a 3D Artist, Animator, and Filmmaker with a passion for visual storytelling.
          </p>
          <p className="mt-2 text-neutral-900 font-normal">
            My goal is to create meaningful films and unique visual experiences while growing into a filmmaker and director.
          </p>
        </div>

        {/* Sub-quote statement: "Future Director with a passion for meaningful cinema." */}
        <p className="text-[13px] sm:text-[14.5px] md:text-[15px] text-neutral-800 font-mono tracking-normal mb-8 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 inline-block" />
          <span>Future Director with a passion for meaningful cinema.</span>
        </p>

        {/* Action Buttons: "EXPLORE WORKS ↘" and "INITIATE COMMISSION" */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <a
            href="#portfolio"
            className="inline-flex items-center justify-center gap-2 bg-black text-white font-mono text-[11px] sm:text-[12.5px] tracking-wider uppercase font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-neutral-800 transition-all duration-200 cursor-pointer shadow-md no-underline"
          >
            <span>EXPLORE WORKS</span>
            <span className="text-sm leading-none">&#x2198;</span>
          </a>

          <a
            href="#contact"
            className="inline-flex items-center justify-center bg-white/90 text-black border border-black/80 font-mono text-[11px] sm:text-[12.5px] tracking-wider uppercase font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-black hover:text-white transition-all duration-200 cursor-pointer shadow-xs no-underline backdrop-blur-xs"
          >
            INITIATE COMMISSION
          </a>
        </div>
      </div>

      {/* Floating Interactive 3D Cursor Tracking Indicator badge at bottom right */}
      <div className="hidden md:flex absolute bottom-6 right-8 z-10 items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-black/10 backdrop-blur-md shadow-xs pointer-events-none text-[11px] font-mono text-neutral-700 select-none">
        <Compass className="w-3.5 h-3.5 text-[#E09015] animate-spin" style={{ animationDuration: '8s' }} />
        <span>Live 3D Cursor Scrubbing</span>
      </div>
    </section>
  );
};
