import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'

export type ApodSlide = {
  date: string
  title: string
  url: string
  hdurl?: string
  explanation?: string
}

type CarouselProps = {
  slides: ApodSlide[]
  initialIndex?: number
}

export default function Corrossel({ slides, initialIndex = 0 }: CarouselProps) {
  const safeInitial = useMemo(() => {
    if (slides.length === 0) return 0
    return Math.min(Math.max(0, initialIndex), slides.length - 1)
  }, [initialIndex, slides.length])

  const [currentIndex, setCurrentIndex] = useState(() => safeInitial)
  const visibleIndex = Math.min(Math.max(0, currentIndex), Math.max(0, slides.length - 1))
  const current = slides[visibleIndex]

  function prev() {
    if (slides.length === 0) return
    setCurrentIndex((i) => (i - 1 + slides.length) % slides.length)
  }

  function next() {
    if (slides.length === 0) return
    setCurrentIndex((i) => (i + 1) % slides.length)
  }

  if (slides.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
        Nenhuma imagem para exibir.
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        <div className="aspect-[16/9] w-full bg-black">
          <img
            className="h-full w-full object-contain"
            src={current.hdurl ?? current.url}
            alt={current.title}
            loading="lazy"
          />
        </div>

        <button
          type="button"
          onClick={prev}
          aria-label="Imagem anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="Próxima imagem"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <div className="text-sm text-white/80">{current.date}</div>
            <div className="text-base font-semibold text-white">{current.title}</div>
          </div>
          {current.explanation ? (
            <p className="mt-1 line-clamp-3 text-sm text-white/75">{current.explanation}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="text-sm text-white/70">
          {visibleIndex + 1} / {slides.length}
        </div>

        <div className="flex max-w-full items-center gap-2 overflow-x-auto py-1">
          {slides.slice(0, 24).map((s, idx) => (
            <button
              key={`${s.date}-${idx}`}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir para imagem ${idx + 1}`}
              className={[
                'h-12 w-20 flex-none overflow-hidden rounded-lg border',
                idx === visibleIndex
                  ? 'border-white/70 ring-2 ring-white/20'
                  : 'border-white/10 hover:border-white/25',
              ].join(' ')}
              title={s.title}
            >
              <img className="h-full w-full object-cover" src={s.url} alt={s.title} loading="lazy" />
            </button>
          ))}
          {slides.length > 24 ? (
            <div className="flex-none text-xs text-white/60">+{slides.length - 24}</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}