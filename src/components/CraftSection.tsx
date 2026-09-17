import React, { useState } from 'react';
import { Camera, Layers, PenTool, Sparkles, Sliders, ArrowUpRight, Film, CheckCircle2 } from 'lucide-react';

interface CraftSectionProps {
  onOpenContact: () => void;
}

export const CraftSection: React.FC<CraftSectionProps> = ({ onOpenContact }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const pillars = [
    {
      id: '01',
      stage: 'Pre-Production',
      title: 'Narrative & Storyboarding',
      icon: PenTool,
      summary: 'Deconstructing raw emotions into deliberate visual beats.',
      description:
        'Every frame begins as a feeling. We sculpt the visual pacing, character motivation, and spatial blocking on paper before any camera rolls or vertex is placed.',
      tags: ['Scene Breakdown', 'Visual Scripting', 'Pacing & Tone', 'Color Concept'],
      quote: '"A film is made three times: in the writing, in the execution, and in the rhythm."'
    },
    {
      id: '02',
      stage: 'Spatial Synthesis',
      title: '3D Worldbuilding & Animation',
      icon: Layers,
      summary: 'We don’t animate objects, we animate emotions.',
      description:
        'Bridging imagination and physical realism. Crafting complex 3D environments, organic character performances, and simulated light physics that feel tangibly alive.',
      tags: ['3D Modeling & Rigging', 'Kinetic Animation', 'Spatial Volumetrics', 'Photoreal Shading'],
      quote: '"Virtual space should carry the exact same atmospheric weight as the physical world."'
    },
    {
      id: '03',
      stage: 'Principal Direction',
      title: 'Cinematography & Framing',
      icon: Camera,
      summary: 'My vision. My frame. My story.',
      description:
        'Mastering the lens to focus on what matters most. Embracing organic grain, deliberate angles, and deep negative space to draw the audience directly into the heart of the scene.',
      tags: ['Anamorphic Glass', 'Compositional Depth', 'Natural Light Control', 'Visual Tension'],
      quote: '"Cinema is not what we see, but what we feel."'
    },
    {
      id: '04',
      stage: 'Post & Delivery',
      title: 'Color Science & Sound Design',
      icon: Sliders,
      summary: 'Harmonizing tone, grain, and auditory immersion.',
      description:
        'The final touch where picture and sound unite. Tailoring custom color grades with cinematic film emulation and multi-layered soundscapes that evoke visceral memory.',
      tags: ['Film Emulation', 'DaVinci Grading', 'Atmospheric Audio', 'Final 4K Master'],
      quote: '"The cut should breathe with the rhythm of the human pulse."'
    }
  ];

  return (
    <section
      id="craft"
      className="relative bg-[#0A0A0A] text-white py-24 lg:py-32 border-t border-[#262626] overflow-hidden"
    >
      {/* Subtle Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F5AC27]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#F5AC27]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181818] border border-white/5 text-[#F5AC27] text-xs font-mono tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>04 // Creative Discipline & Craft</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight">
              The Architecture of <span className="text-[#F5AC27]">Visual Storytelling</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-sm sm:text-base font-normal max-w-md leading-relaxed">
            From the initial storyboard stroke to final high-definition color mastering — 
            a disciplined workflow driven by emotion, craft, and honest artistic integrity.
          </p>
        </div>

        {/* 4-Step Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            const isSelected = activeTab === index;
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(index)}
                className={`group p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#161616] border-[#F5AC27] shadow-[0_0_25px_rgba(245,172,39,0.12)]'
                    : 'bg-[#121212] border-white/5 hover:border-white/20 hover:bg-[#141414]'
                }`}
              >
                <div>
                  {/* Top Bar with Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-[#F5AC27]">
                      {item.id} // {item.stage}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#F5AC27] text-[#0A0A0A]' : 'bg-[#1E1E1E] text-[#F5AC27] group-hover:bg-[#262626]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="font-display font-bold text-lg text-white mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#F5AC27] font-mono mb-3">
                    {item.summary}
                  </p>
                  <p className="text-xs text-zinc-400 font-normal leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#1C1C1C] text-zinc-300 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Spotlight Banner */}
        <div className="bg-[#141414] border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Quote & Philosophy */}
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4">
                <Film className="w-4 h-4 text-[#F5AC27]" />
                <span>Director’s Commitment</span>
              </div>
              <p className="font-display text-xl sm:text-2xl lg:text-3xl font-medium text-white leading-snug mb-6">
                “Every frame is an emotional exchange. Whether directing a short film, designing a 3D universe, or shooting behind the camera, the objective remains clear: create work that resonates.”
              </p>
              <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F5AC27]" />
                  Independent Vision
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F5AC27]" />
                  Complete Creative Production
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F5AC27]" />
                  Dhaka & Worldwide Remote
                </span>
              </div>
            </div>

            {/* Right Col: Action */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
              <button
                onClick={onOpenContact}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#F5AC27] hover:bg-[#E09817] text-[#0A0A0A] px-8 py-4 rounded-full font-mono text-xs uppercase font-bold tracking-wider transition-all duration-200 shadow-xl cursor-pointer"
              >
                <span>Initiate Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-zinc-500 mt-3 text-center lg:text-right">
                Open for directing, 3D commissions & creative collaborations
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
