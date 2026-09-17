import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { X, Play, Pause, Volume2, VolumeX, Camera } from 'lucide-react';

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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Reset selection and play state whenever modal opens or project changes
    setSelectedStillIndex(null);
    setIsPlaying(true);
    setIsMuted(true);
    setProgress(0);
  }, [project]);

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
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
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
    }
  };

  return (
    <div
      id="project-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0A0A0A]/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#0A0A0A] border border-[#262626] rounded-[24px] overflow-hidden text-white shadow-2xl my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626] bg-[#111111]/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#F5AC27]" />
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              {project.categoryLabel} // {project.year}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Case Study"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Main Media Player / Showcase Stage - High-Quality View with object-contain */}
          <div className="relative aspect-video w-full rounded-[18px] overflow-hidden bg-black border border-white/10 flex items-center justify-center group">
            {showVideo ? (
              <video
                ref={videoRef}
                src={project.videoFull || project.videoPreview}
                poster={currentPoster}
                autoPlay
                playsInline
                muted={isMuted}
                loop
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-contain"
              />
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

            {/* Video Player Controls Simulation (Only shown for video projects) */}
            {showVideo && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-4 sm:p-6 pointer-events-none">
                {/* Top badges */}
                <div className="flex items-center justify-between pointer-events-auto">
                  <span className="bg-[#0A0A0A]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-[#F5AC27] border border-[#F5AC27]/30">
                    {project.client}
                  </span>
                  <span className="text-xs font-mono text-zinc-300 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full">
                    HD // 16:9 PROPORTION
                  </span>
                </div>

                {/* Bottom Playback Bar */}
                <div className="space-y-2 pointer-events-auto">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="w-10 h-10 rounded-full bg-[#F5AC27] text-[#0A0A0A] flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-md"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
                    </button>

                    <div className="grow bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F5AC27] rounded-full transition-all duration-200"
                        style={{ width: `${Math.max(5, progress)}%` }}
                      />
                    </div>

                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#F5AC27]" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stills Gallery Selector (ONLY rendered if project has multiple items) */}
          {project.stills && project.stills.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider shrink-0">
                media select:
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
                  className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer bg-black ${
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

          {/* Titles & Synopsis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-[#262626]">
            <div className="lg:col-span-8">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight lowercase text-white mb-4">
                {project.title}
              </h2>

              <div className="prose prose-invert max-w-none">
                <p className="text-base text-zinc-300 leading-relaxed mb-4">
                  {project.longSynopsis}
                </p>
                {project.description && project.description !== project.longSynopsis && (
                  <p className="text-sm text-zinc-400 leading-relaxed font-mono mb-4">
                    Concept: {project.description}
                  </p>
                )}
              </div>

              {/* Core Highlights / Bullet points */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="pt-4 border-t border-white/10 mt-6">
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
            <div className="lg:col-span-4 bg-[#141414] p-5 rounded-[18px] border border-[#262626] space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-[#F5AC27] flex items-center gap-1.5 pb-2 border-b border-white/10">
                <Camera className="w-3.5 h-3.5" />
                <span>{project.dossierTitle || 'technical dossier'}</span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-zinc-500 block">optics & sensor</span>
                <span className="text-xs font-mono text-zinc-200">{project.cameraSpecs}</span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-zinc-500 block">location</span>
                <span className="text-xs font-mono text-zinc-200">{project.location}</span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-zinc-500 block">director role</span>
                <span className="text-xs font-mono text-zinc-200">{project.role}</span>
              </div>

              {project.highlights && project.highlights.length > 0 && (
                <div>
                  <span className="text-[11px] font-mono uppercase text-zinc-500 block mb-1.5">key points</span>
                  <div className="space-y-1">
                    {project.highlights.map((point, idx) => (
                      <div key={idx} className="text-xs font-mono text-zinc-200 flex items-center gap-1.5">
                        <span className="text-[#F5AC27] font-bold">*</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                className="w-full mt-3 bg-[#F5AC27] hover:bg-[#E09817] text-[#0A0A0A] py-2.5 rounded-full text-xs font-mono uppercase font-bold tracking-wider transition-colors cursor-pointer"
              >
                inquire about similar work
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
