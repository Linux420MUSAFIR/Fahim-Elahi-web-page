export interface Project {
  id: string;
  title: string;
  category: 'animation' | 'vfx' | 'product-visualization' | 'film-shortfilm' | 'character-modeling' | 'photography' | string;
  categoryLabel: string;
  year: string;
  client: string;
  role: string;
  image: string;
  poster?: string;
  videoPreview?: string;
  videoWebm?: string;
  videoFull?: string;
  aspectRatio: string; // e.g. 'aspect-[4/5]', 'aspect-[16/9]', 'aspect-square'
  spanClasses: string; // Tailwind grid span classes
  description: string;
  longSynopsis: string;
  cameraSpecs: string;
  location: string;
  metrics?: string;
  stills: string[];
  featured?: boolean;
  dossierTitle?: string;
  highlights?: string[];
}
