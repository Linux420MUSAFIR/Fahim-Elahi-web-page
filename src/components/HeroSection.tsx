import React, { useRef, useEffect } from 'react';

export const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = videoContainerRef.current;
    if (!video || !container) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Center resting progress (0.5 = looking straight ahead)
    let targetProgress = 0.5;
    let currentProgress = 0.5;
    let targetProgressY = 0.5;
    let currentProgressY = 0.5;

    let animId: number | null = null;
    let isSeeking = false;
    let pendingSeekTime: number | null = null;
    let seekTimeoutId: number | null = null;
    let isHeroInView = true;
    let activeBlobUrl: string | null = null;

    // Eagerly preload video directly into browser memory (RAM) via Blob.
    // This eliminates Vercel Edge / CDN network Range request roundtrips during mouse scrub.
    const controller = new AbortController();
    fetch('/character-anim.mp4', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Blob fetch failed');
        return res.blob();
      })
      .then((blob) => {
        if (!video) return;
        activeBlobUrl = URL.createObjectURL(blob);
        const curTime = video.currentTime || targetProgress * (video.duration || 5.06);
        video.src = activeBlobUrl;
        video.load();
        video.currentTime = curTime;
      })
      .catch(() => {
        // Fallback to standard <source> loading
      });

    // Cache viewport dimensions to avoid forced synchronous layout on mousemove
    let cachedWidth = window.innerWidth || 1;
    let cachedHeight = window.innerHeight || 1;

    const onResize = () => {
      cachedWidth = window.innerWidth || 1;
      cachedHeight = window.innerHeight || 1;
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Direct cursor progress mapping:
    // Left (normX ~ 0) -> progress ~ 0
    // Right (normX ~ 1) -> progress ~ 1
    const updatePointer = (clientX: number, clientY: number) => {
      if (!isHeroInView || prefersReducedMotion) return;
      const normX = Math.max(0, Math.min(clientX / cachedWidth, 1));
      const normY = Math.max(0, Math.min(clientY / cachedHeight, 1));
      
      // Direct mouse tracking: character follows the cursor
      targetProgress = Math.max(0.01, Math.min(0.99, normX));
      targetProgressY = normY;
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

    // IntersectionObserver to suspend physics loop & video processing when scrolled out of view
    const observer = new IntersectionObserver(
      (entries) => {
        isHeroInView = entries[0].isIntersecting;
        if (!isHeroInView) {
          if (animId !== null) {
            cancelAnimationFrame(animId);
            animId = null;
          }
          if (!video.paused) {
            video.pause();
          }
        } else if (isHeroInView && animId === null && !prefersReducedMotion) {
          animId = requestAnimationFrame(renderLoop);
        }
      },
      { threshold: 0.05 }
    );

    const sectionEl = document.getElementById('home');
    if (sectionEl) {
      observer.observe(sectionEl);
    }

    const onLoadedMetadata = () => {
      video.pause();
      if (video.duration && !isNaN(video.duration)) {
        const initialTime = targetProgress * video.duration;
        video.currentTime = initialTime;
      }
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    if (video.readyState >= 1 && video.duration) {
      onLoadedMetadata();
    }

    const onSeeked = () => {
      isSeeking = false;
      if (seekTimeoutId !== null) {
        window.clearTimeout(seekTimeoutId);
        seekTimeoutId = null;
      }
      if (pendingSeekTime !== null && video && video.duration) {
        const next = pendingSeekTime;
        pendingSeekTime = null;
        if (Math.abs(next - video.currentTime) > 0.015) {
          isSeeking = true;
          video.currentTime = next;
        }
      }
    };

    const applySeek = (time: number) => {
      if (!video || !video.duration || isNaN(time)) return;
      const clampedTime = Math.max(0.05, Math.min(time, video.duration - 0.05));

      if (isSeeking || video.seeking) {
        pendingSeekTime = clampedTime;
        return;
      }

      isSeeking = true;
      try {
        if ('fastSeek' in video && typeof (video as any).fastSeek === 'function') {
          (video as any).fastSeek(clampedTime);
        } else {
          video.currentTime = clampedTime;
        }
      } catch {
        video.currentTime = clampedTime;
      }

      // Fallback safety timeout in case the seeked event doesn't trigger
      if (seekTimeoutId !== null) window.clearTimeout(seekTimeoutId);
      seekTimeoutId = window.setTimeout(() => {
        isSeeking = false;
        if (pendingSeekTime !== null && video && video.duration) {
          const next = pendingSeekTime;
          pendingSeekTime = null;
          video.currentTime = next;
        }
      }, 40);
    };

    video.addEventListener('seeked', onSeeked);

    // Ultra-smooth 60fps lerp physics loop
    const renderLoop = () => {
      if (!isHeroInView) return;

      const diffX = targetProgress - currentProgress;
      const diffY = targetProgressY - currentProgressY;

      // Silky responsive exponential damping so it closely tracks the mouse without lag
      if (Math.abs(diffX) > 0.0001 || Math.abs(diffY) > 0.0001) {
        currentProgress += diffX * 0.18;
        currentProgressY += diffY * 0.18;

        // Subtle 3D parallax tracking along with cursor
        const shiftX = (currentProgress - 0.5) * 28;
        const shiftY = (currentProgressY - 0.5) * 16;
        container.style.transform = `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0) scale(1.03)`;

        // Ultra-smooth video scrub seeking
        if (video && video.duration && !isNaN(video.duration)) {
          if (!video.paused) {
            video.pause();
          }

          const desiredTime = currentProgress * video.duration;
          if (Math.abs(desiredTime - video.currentTime) > 0.012) {
            applySeek(desiredTime);
          }
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    if (isHeroInView && !prefersReducedMotion) {
      animId = requestAnimationFrame(renderLoop);
    }

    return () => {
      controller.abort();
      if (animId !== null) cancelAnimationFrame(animId);
      if (seekTimeoutId !== null) window.clearTimeout(seekTimeoutId);
      if (activeBlobUrl) {
        URL.revokeObjectURL(activeBlobUrl);
      }
      observer.disconnect();
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('seeked', onSeeked);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative w-full min-h-[100dvh] flex flex-col justify-end md:justify-center items-start px-5 sm:px-10 md:px-16 lg:px-20 overflow-hidden select-none pt-24 pb-12 sm:pb-16 md:py-0"
    >
      {/* 
        CONTAINER WITH MOUSE-SCRUBBED 3D CHARACTER ANIMATION
        Optimized with GPU translate3d and instantaneous poster fallback
      */}
      <div
        ref={videoContainerRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0 will-change-transform bg-[#F9F7F4]"
        style={{
          backgroundImage: 'url(/hero-poster.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'translate3d(0px, 0px, 0) scale(1.03)',
        }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay={false}
          loop={false}
          preload="auto"
          crossOrigin="anonymous"
          poster="/hero-poster.webp"
          disablePictureInPicture
          className="w-full h-full object-cover select-none pointer-events-none object-[70%_25%] md:object-[78%_25%]"
        >
          {/* Local high-speed intra-frame version (Zero-lag instant seek) */}
          <source src="/character-anim.mp4" type="video/mp4" />
          {/* Fallback CDN link */}
          <source src="https://res.cloudinary.com/v3pwznsb/video/upload/v1789555490/0916.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 
        GRID OVERLAY
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
        HERO SECTION CONTENT
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
    </section>
  );
};
