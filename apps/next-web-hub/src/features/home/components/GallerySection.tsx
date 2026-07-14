"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, ExternalLink, Maximize2 } from 'lucide-react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import { fetchGooglePhotosAlbum } from '@/infrastructure/api/googlePhotos.api';

const ALBUM_ID = 'AF1QipM_Pvay5MxXYExMblglEE_M5T00PfW6V8-Eh_UtghAsxkzSGY4fzNTzwN6jtYEBCA?key=dG5FbVZiMVVwSzhIcHVUWElqMUk3MDNHYjBCV1BR';
const ALBUM_URL = ALBUM_ID.startsWith('http') ? ALBUM_ID : ALBUM_ID.length > 20 ? `https://photos.google.com/share/${ALBUM_ID}` : `https://photos.app.goo.gl/${ALBUM_ID}`;

export const GallerySection = () => {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<Record<string, string>[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  
  const [visibleCount, setVisibleCount] = useState(12);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const loadPhotos = async () => {
          setLoadingPhotos(true);
          const albumPhotos = await fetchGooglePhotosAlbum(ALBUM_ID);
          setPhotos(albumPhotos);
          setLoadingPhotos(false);
        };
        loadPhotos();
        observer.disconnect();
      }
    }, { rootMargin: '200px' });

    const el = document.getElementById('gallery');
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="gallery" className="py-24 bg-white relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16 flex-wrap gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-4 font-display">{t('gallery.title', 'Community Gallery')}</h2>
            <p className="text-stone-500 text-xs sm:text-sm font-black uppercase tracking-[0.4em] flex items-center gap-3">
              <ImageIcon size={18} className="text-saffron-600" />
              {t('gallery.heritage', 'Our Heritage in Pictures')}
            </p>
          </motion.div>
          <a
            href={ALBUM_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 text-saffron-700 font-bold bg-saffron-50 px-8 py-4 rounded-2xl hover:bg-saffron-100 transition-all border border-saffron-100 shadow-sm active:scale-95 text-sm"
          >
            {t('gallery.viewGoogle', 'View on Google Photos')}
            <ExternalLink size={18} />
          </a>
        </div>

        {loadingPhotos ? (
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="w-full h-[40vh] sm:h-[60vh] max-h-[600px] bg-stone-50 rounded-[1.5rem] sm:rounded-[2.5rem] animate-pulse" />
            <div className="columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-stone-50 rounded-[1rem] sm:rounded-[1.5rem] break-inside-avoid animate-pulse" style={{ height: `${[280, 320, 240, 360, 300, 260, 340, 220, 380, 250, 310, 270][i % 12]}px` }} />
              ))}
            </div>
          </div>
        ) : photos.length > 0 ? (
          <>
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Highlighted Big Image */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative w-full h-[40vh] sm:h-[60vh] max-h-[600px] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden bg-stone-100 shadow-xl cursor-pointer"
                onClick={() => {
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={photos[0].original}
                  alt="Featured Community Highlight"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-10 pointer-events-none">
                  <div>
                    <h3 className="text-white text-xl sm:text-3xl font-black mb-2">{t('gallery.featured', 'Community Highlight')}</h3>
                    <p className="text-white/80 text-xs sm:text-sm font-bold uppercase tracking-widest">{t('gallery.click_to_expand', 'Click to expand gallery')}</p>
                  </div>
                </div>
              </motion.div>

              {/* Masonry Layout for remaining images */}
              <div className="columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6 mt-2">
                {photos.slice(1, visibleCount).map((photo, index) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    key={photo.id} 
                    className="group relative break-inside-avoid rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden bg-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer inline-block w-full"
                    onClick={() => {
                      setLightboxIndex(index + 1);
                      setLightboxOpen(true);
                    }}
                  >
                    <img
                      src={photo.thumbnail}
                      alt="Community Photo"
                      className="w-full h-auto block transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 sm:group-hover:opacity-100 transition-all duration-500 flex items-end p-3 sm:p-4 sm:opacity-0 max-sm:opacity-100">
                      <div className="w-full text-white text-[10px] font-black flex items-center justify-center gap-2 bg-black/40 hover:bg-vermilion py-2 rounded-xl backdrop-blur-md transition-all border border-white/20">
                        <Maximize2 size={14} />
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Dynamic Empty Padded Placeholders for Masonry */}
                {[...Array(Math.max(0, visibleCount - photos.length))].map((_, i) => (
                  <div key={`placeholder-${i}`} className="bg-stone-50 rounded-[1rem] sm:rounded-[1.5rem] border-2 border-dashed border-stone-200 aspect-[4/3] flex items-center justify-center flex-col gap-3 break-inside-avoid w-full inline-block">
                    <ImageIcon className="text-stone-400" size={32} />
                    <span className="text-stone-600 text-[10px] sm:text-xs font-black uppercase tracking-widest text-center px-4 leading-tight">{t('gallery.coming_soon', 'More Coming Soon')}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {photos.length > visibleCount && (
              <div className="mt-16 text-center">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 4)}
                  className="inline-flex items-center gap-3 bg-stone-900 text-white px-10 py-4 rounded-full font-black hover:bg-vermilion transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest"
                >
                  Load More Photos
                </button>
              </div>
            )}

            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              index={lightboxIndex}
              slides={photos.map(p => ({ src: p.original }))}
              plugins={[Fullscreen, Slideshow, Zoom]}
              animation={{ zoom: 300 }}
            />
          </>
        ) : (
          <div className="bg-stone-50/50 border-4 border-dashed border-stone-100 rounded-[3rem] p-20 text-center">
            <p className="text-stone-400 font-bold mb-2">{t('gallery.noPhotos', 'No photos available')}</p>
            <p className="text-[10px] text-stone-300 font-medium">(Verify ALBUM_ID and shared link visibility)</p>
          </div>
        )}
      </div>
    </section>
  );
};
