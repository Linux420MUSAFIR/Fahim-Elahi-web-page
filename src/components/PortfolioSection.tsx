import React, { useState } from 'react';
import { Project } from '../types';
import { portfolioProjects } from '../data/portfolioData';
import { ArrowUpRight, Sparkles, Clock, Film, Camera, Play } from 'lucide-react';
import { LazyVideo } from './LazyVideo';

interface PortfolioSectionProps {
  onSelectProject?: (project: Project) => void;
  onOpenProject?: (projectId: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onSelectProject, onOpenProject }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleSelect = (project: Project) => {
    if (onSelectProject) {
      onSelectProject(project);
    } else if (onOpenProject) {
      onOpenProject(project.id);
    }
  };

  const categories = [
    { id: 'all', label: 'all works' },
    { id: 'animation', label: 'animation' },
    { id: 'vfx', label: 'vfx & cgi' },
    { id: 'character-modeling', label: 'character modeling' },
    { id: 'product-visualization', label: 'product viz' },
  ];

  const filteredProjects = activeCategory === 'all'
    ? portfolioProjects
    : portfolioProjects.filter((p) => p.category === activeCategory);

  return (
    <section
      id="portfolio"
      className="py-24 lg:py-32 px-5 sm:px-8 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#E5E5E5]">
        <div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#0A0A0A] leading-none">
            Projects
          </h2>
        </div>

        {/* Category Filters - Smooth horizontal scroll on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap w-full sm:w-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-mono tracking-tight transition-all duration-200 cursor-pointer shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-[#0A0A0A] text-white shadow-xs font-semibold'
                  : 'bg-white hover:bg-[#E5E5E5] text-[#555555] border border-[#E5E5E5]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* When category has projects */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              id={`portfolio-card-${project.id}`}
              onClick={() => handleSelect(project)}
              className={`${project.spanClasses} group relative rounded-[18px] sm:rounded-[24px] overflow-hidden bg-[#0A0A0A] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              {/* Media Box with Lazy Video & Poster Optimization */}
              <div className={`relative w-full ${project.aspectRatio} overflow-hidden`}>
                <LazyVideo
                  id={project.id}
                  poster={project.poster || project.image}
                  videoSrc={project.videoPreview}
                  videoWebm={project.videoWebm}
                  alt={project.title}
                  aspectRatioClass="w-full h-full"
                  className="transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Hover golden tint overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute inset-0 bg-[#F5AC27]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Floating Pill Badges: Top Left Category */}
                <div className="absolute top-3.5 sm:top-4 left-3.5 sm:left-4 flex items-center gap-2 z-10 pointer-events-none">
                  <span className="bg-[#0A0A0A]/85 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-mono px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/15 flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5AC27]" />
                    {project.categoryLabel}
                  </span>
                  {project.featured && (
                    <span className="bg-[#F5AC27] text-[#0A0A0A] text-[10px] sm:text-[11px] font-mono font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      featured
                    </span>
                  )}
                </div>

                {/* Floating Pill Badge: Top Right Year */}
                <div className="absolute top-3.5 sm:top-4 right-3.5 sm:right-4 z-10 pointer-events-none">
                  <span className="bg-white/90 backdrop-blur-md text-[#0A0A0A] text-[10px] sm:text-[11px] font-mono font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xs">
                    {project.year}
                  </span>
                </div>

                {/* Floating Quick Action / Play Reel Button */}
                <div className="absolute inset-0 m-auto w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-[#0A0A0A]/75 sm:bg-white text-white sm:text-[#0A0A0A] backdrop-blur-md sm:backdrop-blur-none border border-white/20 sm:border-transparent flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl z-20 pointer-events-none">
                  <Play className="w-5 sm:w-6 h-5 sm:h-6 fill-[#F5AC27] sm:fill-[#0A0A0A] text-[#F5AC27] sm:text-[#0A0A0A] translate-x-0.5" />
                </div>

                {/* Bottom Card: Title & Mobile Tap Indicator */}
                <div className="absolute bottom-0 left-0 right-0 pt-12 pb-3.5 sm:pb-5 px-3.5 sm:px-6 bg-gradient-to-t from-[#0A0A0A]/95 via-[#0A0A0A]/60 to-transparent text-white flex items-end justify-between gap-3 z-10 pointer-events-none">
                  <div>
                    <h3 className="font-display font-extrabold text-base sm:text-xl md:text-2xl lg:text-[26px] tracking-tight lowercase leading-tight text-white group-hover:text-[#F5AC27] transition-colors drop-shadow-sm">
                      {project.title}
                    </h3>
                    <span className="text-[10px] sm:hidden font-mono text-[#F5AC27] flex items-center gap-1 mt-0.5 font-bold">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      tap to watch large video
                    </span>
                  </div>
                  
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono text-zinc-300 group-hover:text-[#F5AC27] transition-colors shrink-0 bg-white/10 sm:bg-transparent px-2.5 sm:px-0 py-1 sm:py-0 rounded-full sm:rounded-none">
                    <span className="hidden sm:inline">watch reel</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#F5AC27]" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Coming Soon State for empty categories (film-shortfilm & photography) */
        <div className="w-full py-20 sm:py-28 px-6 rounded-[28px] bg-[#0A0A0A] border border-[#262626] text-center flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          {/* Subtle geometric background line */}
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 max-w-md flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#F5AC27]/40 text-[#F5AC27] flex items-center justify-center mb-6 shadow-lg">
              {activeCategory === 'film-shortfilm' ? (
                <Film className="w-7 h-7" />
              ) : (
                <Camera className="w-7 h-7" />
              )}
            </div>

            <div className="inline-flex items-center gap-2 bg-[#F5AC27]/10 border border-[#F5AC27]/30 text-[#F5AC27] px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider mb-4">
              <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>In Post-Production // Curation Stage</span>
            </div>

            <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight lowercase mb-3">
              {activeCategory === 'film-shortfilm' ? 'Film & Short Film' : 'Photography'}
            </h3>

            <p className="text-zinc-400 text-sm font-sans leading-relaxed mb-6">
              Projects in this discipline are currently in post-production and grading. The case study reel and stills gallery will be unveiled shortly.
            </p>

            <div className="text-xs font-mono text-[#F5AC27] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-dashed border-[#F5AC27]/50">
              COMING SOON
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
