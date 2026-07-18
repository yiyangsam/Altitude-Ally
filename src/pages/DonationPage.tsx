import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarDays, ChevronLeft, ChevronRight, ExternalLink, QrCode, X } from 'lucide-react';
import { DonationProject, useData } from '../lib/DataContext';

const defaultDonationConfig = {
  title: 'Placeholder',
  subtitle: 'Placeholder',
  bottom_title: 'Placeholder',
  tzuchi_link_text: 'Placeholder',
  tzuchi_link_url: 'https://www.tzuchi.org.tw/en/',
  qr_image: '',
  qr_caption: 'Placeholder'
};

function getExternalUrl(value: string) {
  if (!value) return '#';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function showFallbackImage(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  image.onerror = null;
  image.src = '/logo.png';
  image.classList.remove('object-cover');
  image.classList.add('object-contain', 'p-10');
}

function formatProjectDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export default function DonationPage() {
  const { donationProjects, donationPageConfig } = useData();
  const [selectedProject, setSelectedProject] = useState<DonationProject | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const config = donationPageConfig || defaultDonationConfig;

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
          {config.title}
        </motion.h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-on-surface-variant md:mt-6 md:text-xl">
          {config.subtitle}
        </p>
      </header>

      <section aria-label="Donation projects" className="pb-14 md:pb-24">
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
          {donationProjects.length > 0 ? donationProjects.map((project) => (
            <motion.button
              key={project.id}
              type="button"
              whileHover={{ y: -4 }}
              onClick={() => setSelectedProject(project)}
              className="group relative aspect-[4/3] min-w-[82vw] snap-start overflow-hidden rounded-2xl bg-surface-container-high text-left shadow-lg sm:min-w-[380px] lg:min-w-[460px]"
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
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={15} />
                    {formatProjectDate(project.date)}
                  </span>
                  {project.amount_enabled && project.amount && (
                    <span className="font-bold text-white">{project.amount}</span>
                  )}
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
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-[1fr_360px] md:px-8">
          <div className="text-center md:text-left">
            <h2 className="font-serif text-3xl font-bold text-on-surface md:text-5xl">{config.bottom_title}</h2>
            <a
              href={getExternalUrl(config.tzuchi_link_url)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-lg font-bold text-primary underline underline-offset-4 hover:text-secondary md:text-xl"
            >
              {config.tzuchi_link_text}
              <ExternalLink size={19} />
            </a>
          </div>

          <div className="mx-auto w-full max-w-sm text-center">
            <div className="aspect-square w-full overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-sm">
              {config.qr_image ? (
                <img src={config.qr_image} alt="Direct donation QR code" className="h-full w-full object-contain" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-outline">
                  <QrCode size={72} strokeWidth={1.4} />
                  <span className="text-sm font-bold uppercase">Donation QR</span>
                </div>
              )}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">{config.qr_caption}</p>
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
              aria-labelledby="donation-project-title"
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
                <h2 id="donation-project-title" className="font-serif text-3xl font-bold text-on-surface md:text-4xl">
                  {selectedProject.title}
                </h2>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-on-surface-variant">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={17} />
                    {formatProjectDate(selectedProject.date)}
                  </span>
                  {selectedProject.amount_enabled && selectedProject.amount && (
                    <span className="font-bold text-primary">{selectedProject.amount}</span>
                  )}
                </div>
                <div className="mt-4 max-h-[24vh] overflow-y-auto pr-3 text-sm leading-7 text-on-surface-variant md:text-base">
                  <p className="whitespace-pre-wrap">{selectedProject.description || 'Placeholder'}</p>
                </div>
              </div>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
