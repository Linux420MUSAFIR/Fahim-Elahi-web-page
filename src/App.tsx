import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MarqueeBanner } from './components/MarqueeBanner';
import { AboutSection } from './components/AboutSection';
import { PortfolioSection } from './components/PortfolioSection';
import { CraftSection } from './components/CraftSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ProfileDrawer } from './components/ProfileDrawer';
import { portfolioProjects } from './data/portfolioData';
import { Project } from './types';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  const handleOpenProject = (projectId: string) => {
    const proj = portfolioProjects.find((p) => p.id === projectId);
    if (proj) {
      setSelectedProject(proj);
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  const handleOpenContactModal = () => {
    setIsContactOpen(true);
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#F7F6F2] text-[#111111] antialiased selection:bg-[#F5AC27] selection:text-[#0A0A0A]">
      {/* 1. Fixed Top Navbar (z-index: 50) */}
      <Navbar
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenContact={handleOpenContactModal}
      />

      {/* 2. Full-Screen Hero Landing Section with Mouse-Scrub Video */}
      <HeroSection />

      {/* 3. Ticker / Marquee Banner matching screenshot footer */}
      <div className="relative z-10">
        <MarqueeBanner
          text={[
            'teller',
            'animator',
            '3d artist',
            'honest person',
            'cinematographer',
            'director'
          ]}
        />
      </div>

      {/* 4. Complete Main Content Sections (About, Works, Craft, Contact) */}
      <main className="relative z-10 bg-[#F7F6F2]">
        <AboutSection
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenContact={handleOpenContactModal}
        />
        <PortfolioSection
          onSelectProject={handleSelectProject}
          onOpenProject={handleOpenProject}
        />
        <CraftSection />
        <ContactSection />
      </main>

      {/* 5. Footer */}
      <Footer
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenContact={handleOpenContactModal}
      />

      {/* 6. Interactive Modals & Drawers */}
      <ProjectModal
        project={selectedProject}
        onClose={handleCloseProject}
        onOpenContact={handleOpenContactModal}
      />
      <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
