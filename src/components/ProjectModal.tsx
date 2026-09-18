import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Project } from '../types';
import { X, Play, Pause, Volume2, VolumeX, Camera, Maximize2, Minimize2, Sparkles } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenContact: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onOpenContact }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedStillIndex, setSelectedStillIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState('0:00');
  const [durationFormatted, setDurationFormatted] = useState('0:00');
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [showPlayAnimation, setShowPlayAnimation] = useState<'play' | 'pause' | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Lock background scrolling when modal is active
  useEffect(() => {
    if (project) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [project]);

  // Handle ESC key to exit theater or close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isTheaterMode) {
          setIsTheaterMode(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTheaterMode, onClose]);

  useEffect(() => {
    // Reset selection and play state whenever modal opens or project changes
    setSelectedStillIndex(null);
    setIsPlaying(true);
    setIsMuted(true);
    setProgress(0);
    setIsTheaterMode(false);
  }, [project]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!project) return null;

  const currentPoster =
    project.poster ||
    project.image ||
    (project.videoPreview ? project.videoPreview.replace(/\.[^/.]+$/, '.jpg') : '');
  const hasVideo = Boolean(project.videoFull || project.videoPreview);
  const showVideo = selectedStillIndex === null && hasVideo;

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play().catch(() => {});
        setIsPlaying(true);
        triggerPlayFeedback('play');
      } else {
        video.pause();
        setIsPlaying(false);
        triggerPlayFeedback('pause');
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const triggerPlayFeedback = (type: 'play' | 'pause') => {
    setShowPlayAnimation(type);
    setTimeout(() => {
      setShowPlayAnimation(null);
    }, 600);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      setIsMuted(video.muted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTimeFormatted(formatTime(video.currentTime));
      setDurationFormatted(formatTime(video.duration));
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current;
    const video = videoRef.current;
    if (!bar || !video || !video.duration) return;

    const rect = bar.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    video.currentTime = percentage * video.duration;
    setProgress(percentage * 100);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    // Attempt mobile native webkit fullscreen (iOS Safari / Android)
    if (video && typeof (video as any).webkitEnterFullscreen === 'function' && !isTheaterMode) {
      try {
        (video as any).webkitEnterFullscreen();
        return;
      } catch {
        // Fallback to in-app theater mode
      }
    }

    // Attempt browser standard requestFullscreen
    if (!isTheaterMode && video && video.requestFullscreen) {
      video.requestFullscreen().catch(() => {
        // Fallback to in-app theater mode if browser or iframe blocks fullscreen API
        setIsTheaterMode(true);
      });
    } else {
      setIsTheaterMode((prev) => !prev);
    }
  };

  return (
    <div
      id="project-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-[#0A0A0A]/95 backdrop-blur-lg overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${
          isTheaterMode
            ? 'fixed inset-0 z-50 h-full max-h-none rounded-none bg-black border-none my-0 flex flex-col justify-between'
            : 'max-w-5xl bg-[#0A0A0A] border-0 sm:border border-[#262626] rounded-none sm:rounded-[24px] overflow-hidden text-white shadow-2xl my-0 sm:my-8 h-full sm:h-auto sm:max-h-[92vh] flex flex-col'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#262626] bg-[#111111]/90 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5AC27] shrink-0 animate-pulse" />
            <span className="text-xs sm:text-xs font-mono uppercase tracking-wider text-zinc-300 truncate">
              {project.categoryLabel} <span className="text-zinc-500">//</span> {project.year}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Fullscreen / Theater Toggle Button on Header */}
            {hasVideo && (
              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                title={isTheaterMode ? 'Exit Theater View' : 'Open Large Fullscreen View'}
              >
                {isTheaterMode ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-[#F5AC27]" />
                    <span className="hidden xs:inline">exit theater</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-[#F5AC27]" />
                    <span className="text-[11px] sm:text-xs font-bold text-[#F5AC27]">large view</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Case Study"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className={`overflow-y-auto ${isTheaterMode ? 'grow flex flex-col justify-center p-2 sm:p-6' : 'p-3 sm:p-6 md:p-8 space-y-6 sm:space-y-8'}`}>
          {/* Main Media Player / Showcase Stage - High-Quality View optimized for Phone & Desktop */}
          <div
            className={`relative w-full overflow-hidden bg-black border border-white/10 flex items-center justify-center group select-none ${
              isTheaterMode
                ? 'h-full max-h-[82vh] rounded-xl'
                : 'aspect-video rounded-[14px] sm:rounded-[18px] shadow-2xl'
            }`}
          >
            {showVideo ? (
              <div
                className="relative w-full h-full flex items-center justify-center cursor-pointer"
                onClick={togglePlay}
              >
                <video
                  ref={videoRef}
                  src={project.videoFull || project.videoPreview}
                  poster={currentPoster}
                  autoPlay
                  playsInline
                  muted={isMuted}
                  loop
                  preload="auto"
                  onTimeUpdate={handleTimeUpdate}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-contain"
                />

                {/* Animated Central Tap-To-Play Indicator */}
                {showPlayAnimation && (
                  <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/75 backdrop-blur-md border border-[#F5AC27] text-[#F5AC27] flex items-center justify-center animate-ping pointer-events-none z-30">
                    {showPlayAnimation === 'play' ? (
                      <Play className="w-8 h-8 fill-current translate-x-0.5" />
                    ) : (
                      <Pause className="w-8 h-8 fill-current" />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <img
                src={
                  selectedStillIndex !== null && project.stills && project.stills[selectedStillIndex]
                    ? project.stills[selectedStillIndex]
                    : currentPoster
                }
                alt={project.title}
                loading="eager"
                decoding="async"
                className={`w-full h-full object-contain transition-all duration-700 ${
                  isPlaying ? 'scale-100' : 'scale-95'
                }`}
                referrerPolicy="no-referrer"
              />
            )}

            {/* Video Player Controls Overlay (Only shown for video projects) */}
            {showVideo && (
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 flex flex-col justify-between p-3 sm:p-5 pointer-events-none transition-opacity duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top badges */}
                <div className="flex items-center justify-between pointer-events-auto">
                  <span className="bg-[#0A0A0A]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono text-[#F5AC27] border border-[#F5AC27]/30 shadow-xs">
                    {project.client}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Unmute prompt banner on mobile if muted */}
                    {isMuted && (
                      <button
                        onClick={toggleMute}
                        className="bg-[#F5AC27] text-[#0A0A0A] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1 shadow-md hover:scale-105 transition-transform cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Tap for Sound</span>
                      </button>
                    )}

                    <button
                      onClick={toggleFullscreen}
                      className="p-1.5 sm:p-2 rounded-full bg-black/70 hover:bg-black/90 text-zinc-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer border border-white/10"
                      title="Toggle Theater / Fullscreen"
                    >
                      {isTheaterMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4 text-[#F5AC27]" />}
                    </button>
                  </div>
                </div>

                {/* Bottom Playback Bar */}
                <div className="space-y-2 pointer-events-auto bg-black/60 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-white/10">
                  {/* Interactive touch & click scrub bar */}
                  <div
                    ref={progressBarRef}
                    onClick={handleSeek}
                    onTouchStart={handleSeek}
                    onTouchMove={handleSeek}
                    className="relative w-full h-4 flex items-center cursor-pointer group/bar"
                  >
                    <div className="w-full bg-white/20 h-1.5 sm:h-2 rounded-full overflow-hidden transition-all group-hover/bar:h-2.5">
                      <div
                        className="h-full bg-gradient-to-r from-[#F5AC27] to-[#FFAE33] rounded-full relative"
                        style={{ width: `${Math.max(2, progress)}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md border border-[#F5AC27]" />
                      </div>
                    </div>
                  </div>

                  {/* Buttons row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={togglePlay}
                        className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-[#F5AC27] text-[#0A0A0A] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-md shrink-0"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
                      </button>

                      <button
                        onClick={toggleMute}
                        className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-[#F5AC27]" />}
                      </button>

                      <span className="text-[11px] sm:text-xs font-mono text-zinc-300 whitespace-nowrap">
                        {currentTimeFormatted} <span className="text-zinc-600">/</span> {durationFormatted}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={toggleFullscreen}
                        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white text-[11px] sm:text-xs font-mono transition-colors cursor-pointer"
                      >
                        {isTheaterMode ? (
                          <>
                            <Minimize2 className="w-3.5 h-3.5" />
                            <span>Minimize</span>
                          </>
                        ) : (
                          <>
                            <Maximize2 className="w-3.5 h-3.5 text-[#F5AC27]" />
                            <span className="font-bold text-[#F5AC27]">Fullscreen</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stills Gallery Selector (Rendered if project has multiple stills) */}
          {!isTheaterMode && project.stills && project.stills.length > 1 && (
            <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider shrink-0">
                media:
              </span>
              {hasVideo && (
                <button
                  onClick={() => setSelectedStillIndex(null)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider shrink-0 border transition-all cursor-pointer ${
                    selectedStillIndex === null
                      ? 'border-[#F5AC27] bg-[#F5AC27]/20 text-[#F5AC27] font-bold'
                      : 'border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  ▶ Video Reel
                </button>
              )}
              {project.stills.map((still, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedStillIndex(idx)}
                  className={`relative w-16 sm:w-20 h-11 sm:h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-black ${
                    selectedStillIndex === idx
                      ? 'border-[#F5AC27] scale-105 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={still}
                    alt={`Frame ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Titles & Technical Specs Grid (Hidden when in Theater view for pure cinema focus) */}
          {!isTheaterMode && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-4 border-t border-[#262626]">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#F5AC27] uppercase tracking-widest bg-[#F5AC27]/10 px-2.5 py-0.5 rounded-full border border-[#F5AC27]/30">
                    {project.categoryLabel}
                  </span>
                  {project.featured && (
                    <span className="text-xs font-mono text-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#F5AC27]" />
                      Featured Project
                    </span>
                  )}
                </div>

                <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight lowercase text-white leading-tight">
                  {project.title}
                </h2>

                <div className="prose prose-invert max-w-none">
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    {project.longSynopsis}
                  </p>
                  {project.description && project.description !== project.longSynopsis && (
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-mono mt-3">
                      Concept: {project.description}
                    </p>
                  )}
                </div>

                {/* Core Highlights */}
                {project.highlights && project.highlights.length > 0 && (
                  <div className="pt-4 border-t border-white/10 mt-5">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#F5AC27] mb-3">
                      Key Highlights & Technical Focus
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-200">
                      {project.highlights.map((point, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3 py-2 rounded-lg font-mono text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F5AC27] shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Technical Specs & Credits Card */}
              <div className="lg:col-span-4 bg-[#141414] p-4 sm:p-5 rounded-[18px] border border-[#262626] space-y-3.5 sm:space-y-4">
                <div className="text-xs font-mono uppercase tracking-widest text-[#F5AC27] flex items-center gap-1.5 pb-2 border-b border-white/10">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{project.dossierTitle || 'technical dossier'}</span>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase text-zinc-500 block">optics & software</span>
                  <span className="text-xs font-mono text-zinc-200">{project.cameraSpecs}</span>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase text-zinc-500 block">location</span>
                  <span className="text-xs font-mono text-zinc-200">{project.location}</span>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase text-zinc-500 block">artist role</span>
                  <span className="text-xs font-mono text-zinc-200">{project.role}</span>
                </div>

                {project.metrics && (
                  <div>
                    <span className="text-[11px] font-mono uppercase text-zinc-500 block">impact / laurels</span>
                    <span className="text-xs font-mono text-[#F5AC27] font-semibold">{project.metrics}</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                  className="w-full mt-2 bg-[#F5AC27] hover:bg-[#E09817] text-[#0A0A0A] py-3 rounded-full text-xs font-mono uppercase font-bold tracking-wider transition-all duration-200 hover:shadow-lg cursor-pointer"
                >
                  inquire about similar work
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

