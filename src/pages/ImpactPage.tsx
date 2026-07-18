import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, X } from 'lucide-react';
import { ImpactProject, useData } from '../lib/DataContext';

const defaultImpactConfig = {
  hero_title: 'Placeholder',
  hero_description: 'Placeholder',
  showcase_title: 'Placeholder',
  showcase_image: ''
};

function showFallbackImage(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  image.onerror = null;
  image.src = '/logo.png';
  image.classList.remove('object-cover');
  image.classList.add('object-contain', 'p-10');
}

function getStatusLabel(status: ImpactProject['status']) {
  return status === 'Wait' ? 'Upcoming' : status;
}

export default function ImpactPage() {
  const { impactProjects, impactPageConfig } = useData();
  const [selectedProject, setSelectedProject] = useState<ImpactProject | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const config = {
    ...defaultImpactConfig,
    ...impactPageConfig,
    showcase_title: impactPageConfig?.showcase_title || defaultImpactConfig.showcase_title,
    showcase_image: impactPageConfig?.showcase_image || ''
  };

  useEffect(() => {
    if (!selectedProject) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedProject(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selectedProject]);

  const scrollGallery = (direction: -1 | 1) => {
    galleryRef.current?.scrollBy({
      left: direction * Math.min(window.innerWidth * 0.8, 480),
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="mx-auto max-w-7xl px-4 pb-8 pt-10 text-center md:px-8 md:pb-14 md:pt-16">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl font-black text-on-surface md:text-7xl"
        >
          {config.hero_title}
        </motion.h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant md:mt-6 md:text-xl">
          {config.hero_description}
        </p>
      </header>

      <section aria-label="Impact projects" className="pb-14 md:pb-24">
        <div className="mx-auto mb-4 flex max-w-7xl justify-end gap-2 px-4 md:px-8">
          <button
            type="button"
            aria-label="Previous projects"
            onClick={() => scrollGallery(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-lowest text-primary shadow-sm transition-colors hover:bg-surface-container-high"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next projects"
            onClick={() => scrollGallery(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant/30 bg-surface-container-lowest text-primary shadow-sm transition-colors hover:bg-surface-container-high"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div ref={galleryRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 md:gap-6 md:px-8 no-scrollbar">
          {impactProjects.length > 0 ? impactProjects.map(project => (
            <motion.button
              key={project.id}
              type="button"
              whileHover={{ y: -4 }}
              onClick={() => setSelectedProject(project)}
              className="group relative aspect-[4/3] min-w-[74vw] snap-start overflow-hidden rounded-2xl bg-surface-container-high text-left shadow-lg sm:min-w-[330px] lg:min-w-[400px]"
            >
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={showFallbackImage}
              />
              <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/40" />
              <div className="absolute inset-x-0 bottom-0 bg-black/70 px-5 py-4 text-white md:px-7 md:py-6">
                <h2 className="font-serif text-2xl font-bold md:text-3xl">{project.title}</h2>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm text-white/85">
                  <span className="font-bold text-white">{project.amount}</span>
                  {project.status_enabled && <span>{getStatusLabel(project.status)}</span>}
                </div>
              </div>
            </motion.button>
          )) : (
            <div className="flex min-h-72 w-full items-center justify-center border-y border-dashed border-outline-variant/30 px-6 text-center text-on-surface-variant">
              Projects will appear here.
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-outline-variant/20 bg-surface-container-low py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-center font-serif text-3xl font-bold text-on-surface md:text-5xl">
            {config.showcase_title}
          </h2>
          <div className={`mt-8 w-full overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm md:mt-10 ${config.showcase_image ? '' : 'aspect-[16/6] min-h-56'}`}>
            {config.showcase_image ? (
              <img
                src={config.showcase_image}
                alt={config.showcase_title}
                className="block h-auto w-full"
                onError={showFallbackImage}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-outline">
                <ImageIcon size={72} strokeWidth={1.3} />
                <span className="text-sm font-bold uppercase">Image Placeholder</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8">
            <motion.button
              type="button"
              aria-label="Close project details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 h-full w-full bg-on-surface/60 backdrop-blur-sm"
            />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="impact-project-title"
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-2xl"
            >
              <div className="relative h-[38vh] min-h-64 flex-shrink-0 bg-surface-container-high">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={showFallbackImage}
                />
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setSelectedProject(null)}
                  className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/65 text-white transition-colors hover:bg-black/80"
                >
                  <X size={21} />
                </button>
              </div>
              <div className="min-h-0 px-5 py-5 md:px-9 md:py-7">
                <h2 id="impact-project-title" className="font-serif text-3xl font-bold text-on-surface md:text-4xl">
                  {selectedProject.title}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-on-surface-variant">
                  <span className="font-bold text-primary">{selectedProject.amount}</span>
                  {selectedProject.status_enabled && <span>{getStatusLabel(selectedProject.status)}</span>}
                </div>
                <div className="mt-4 max-h-[24vh] overflow-y-auto pr-3 text-sm leading-7 text-on-surface-variant md:text-base">
                  <p className="whitespace-pre-wrap">{selectedProject.details || 'Placeholder'}</p>
                </div>
              </div>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
