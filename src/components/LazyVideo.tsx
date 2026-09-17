import React, { useEffect, useRef, useState } from 'react';

// Global single-active-video coordinator
let activeVideoId: string | null = null;
const listeners = new Set<(currentActiveId: string | null) => void>();

export function setActiveVideo(id: string | null) {
  if (activeVideoId !== id) {
    activeVideoId = id;
    listeners.forEach((listener) => listener(activeVideoId));
  }
}

export function subscribeActiveVideo(listener: (currentActiveId: string | null) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

interface LazyVideoProps {
  id: string;
  poster?: string;
  videoSrc?: string;
  videoWebm?: string;
  alt: string;
  className?: string;
  aspectRatioClass?: string;
}

export const LazyVideo: React.FC<LazyVideoProps> = ({
  id,
  poster,
  videoSrc,
  videoWebm,
  alt,
  className = '',
  aspectRatioClass = 'aspect-video',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // States
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 1. Intersection Observer for near-viewport lazy loading (pre-load range: rootMargin 350px)
  // and visibility tracking for autoplay (threshold 0.4)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Observer 1: Near viewport detector (triggers video element insertion & lightweight load)
    const loadObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          loadObserver.disconnect();
        }
      },
      {
        rootMargin: '350px 0px 350px 0px',
        threshold: 0,
      }
    );

    // Observer 2: Strict visibility detector for autoplay / pause
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        setIsVisible(visible);

        if (visible) {
          // Claim single-active video slot
          setActiveVideo(id);
        } else if (activeVideoId === id) {
          setActiveVideo(null);
        }
      },
      {
        rootMargin: '0px',
        threshold: [0, 0.35, 0.85],
      }
    );

    loadObserver.observe(el);
    visibilityObserver.observe(el);

    return () => {
      loadObserver.disconnect();
      visibilityObserver.disconnect();
      if (activeVideoId === id) {
        setActiveVideo(null);
      }
    };
  }, [id]);

  // 2. Manage single active video playback coordination
  useEffect(() => {
    const unsubscribe = subscribeActiveVideo((currentActiveId) => {
      const video = videoRef.current;
      if (!video) return;

      if (currentActiveId === id && isVisible && !hasError) {
        // Only one video plays across the entire page
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay policy or interrupt, silent catch
          });
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    });

    return () => unsubscribe();
  }, [id, isVisible, hasError]);

  // 3. Sync play/pause when visibility changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible && activeVideoId === id && !hasError) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
    }
  }, [isVisible, hasError, id]);

  const handleLoadedData = () => {
    setVideoLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setVideoLoaded(false);
  };

  const effectivePoster = poster || (videoSrc ? videoSrc.replace(/\.[^/.]+$/, '.jpg') : undefined);

  const handleMouseEnter = () => {
    setActiveVideo(id);
    const video = videoRef.current;
    if (video && !hasError) {
      video.play().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`relative w-full ${aspectRatioClass} overflow-hidden bg-[#0A0A0A] flex items-center justify-center`}
      style={{ contain: 'layout paint' }}
    >
      {/* 1. Poster / Thumbnail Image with WebP/AVIF and Native Lazy Loading */}
      {effectivePoster && (
        <img
          src={effectivePoster}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
            videoLoaded && !hasError && (videoSrc || videoWebm) ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          referrerPolicy="no-referrer"
        />
      )}

      {/* 2. Optimized HTML5 Video Element with object-contain so full video frame is visible */}
      {isNearViewport && !hasError && (videoSrc || videoWebm) && (
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          preload="auto"
          disablePictureInPicture
          onLoadedData={handleLoadedData}
          onError={handleError}
          poster={effectivePoster}
          className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-500 ${
            videoLoaded || !effectivePoster ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        >
          {videoWebm && <source src={videoWebm} type="video/webm" />}
          {videoSrc && <source src={videoSrc} type="video/mp4" />}
        </video>
      )}
    </div>
  );
};
