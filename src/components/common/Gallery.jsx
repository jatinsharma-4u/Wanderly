import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Images } from 'lucide-react'
import { Img } from './Img'
import { useLockBody } from '../../hooks/useLockBody'
import { img, cn } from '../../utils/format'

// Bento gallery with a full-screen lightbox (keyboard + swipe friendly).
export function Gallery({ images, alt = '', className }) {
  const [open, setOpen] = useState(-1)
  useLockBody(open >= 0)

  useEffect(() => {
    if (open < 0) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(-1)
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, images.length])

  const shown = images.slice(0, 4)
  return (
    <>
      <div className={cn('grid h-[300px] gap-2 sm:h-[420px] md:h-[480px]', shown.length > 1 ? 'grid-cols-4 grid-rows-2' : 'grid-cols-1', className)}>
        {shown.map((id, k) => (
          <button
            type="button"
            key={id + k}
            onClick={() => setOpen(k)}
            className={cn(
              'group relative overflow-hidden rounded-[14px]',
              shown.length === 1 && 'col-span-1 row-span-1',
              shown.length > 1 && k === 0 && 'col-span-4 row-span-1 sm:col-span-2 sm:row-span-2',
              shown.length === 2 && k === 1 && 'col-span-4 sm:col-span-2 sm:row-span-2',
              shown.length === 3 && k > 0 && 'col-span-2 sm:col-span-2 sm:row-span-1',
              shown.length === 4 && k === 1 && 'col-span-2 sm:col-span-2',
              shown.length === 4 && k > 1 && 'col-span-1',
              k === 0 && shown.length > 1 && '',
            )}
            aria-label={`Open photo ${k + 1}`}
          >
            <Img id={id} alt={alt} className="absolute inset-0" imgClassName="group-hover:scale-[1.04]" sizes={k === 0 ? '(max-width: 640px) 100vw, 50vw' : '25vw'} priority={k === 0} />
            {k === shown.length - 1 && (
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-ink backdrop-blur">
                <Images className="size-3.5" /> View {images.length} photos
              </span>
            )}
          </button>
        ))}
      </div>

      {createPortal(
        <AnimatePresence>
          {open >= 0 && (
            <motion.div className="fixed inset-0 z-[95] flex flex-col bg-black/95" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Photo gallery">
              <div className="flex items-center justify-between p-4 text-white">
                <span className="text-[13px] font-medium text-white/70">
                  {open + 1} / {images.length}
                </span>
                <button type="button" onClick={() => setOpen(-1)} className="grid size-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close gallery">
                  <X className="size-5" />
                </button>
              </div>
              <div className="relative flex flex-1 items-center justify-center px-4 pb-4">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={open}
                    src={img(images[open], 2000)}
                    alt={alt}
                    className="max-h-full max-w-full rounded-xl object-contain"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -60) setOpen((i) => (i + 1) % images.length)
                      if (info.offset.x > 60) setOpen((i) => (i - 1 + images.length) % images.length)
                    }}
                  />
                </AnimatePresence>
                {images.length > 1 && (
                  <>
                    <button type="button" onClick={() => setOpen((i) => (i - 1 + images.length) % images.length)} className="absolute left-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Previous photo">
                      <ChevronLeft className="size-5" />
                    </button>
                    <button type="button" onClick={() => setOpen((i) => (i + 1) % images.length)} className="absolute right-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Next photo">
                      <ChevronRight className="size-5" />
                    </button>
                  </>
                )}
              </div>
              <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto p-4 pt-0">
                {images.map((id, k) => (
                  <button type="button" key={id + k} onClick={() => setOpen(k)} className={cn('size-14 shrink-0 overflow-hidden rounded-lg transition', k === open ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-100')} aria-label={`Photo ${k + 1}`}>
                    <img src={img(id, 160, 160)} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}
