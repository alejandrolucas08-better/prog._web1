import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import Corrossel, { type ApodSlide } from './Corrossel'

type ApodItem = {
  date: string
  title: string
  explanation?: string
  media_type: 'image' | 'video'
  url: string
  hdurl?: string
  copyright?: string
}

const RAW_API_URL = import.meta.env.VITE_API_URL as string | undefined
const RAW_API_KEY = import.meta.env.VITE_API_KEY as string | undefined

function normalizeApiUrl(input: string | undefined) {
  if (!input) return 'https://api.nasa.gov/planetary/apod'
  const trimmed = input.trim().replace(/\?+$/, '')
  if (!trimmed) return 'https://api.nasa.gov/planetary/apod'
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  // Evita 404 no Vite por URL sem protocolo (ex.: "api.nasa.gov/...")
  return `https://${trimmed.replace(/^\/+/, '')}`
}

const API_URL = normalizeApiUrl(RAW_API_URL)

const API_KEY = RAW_API_KEY && RAW_API_KEY.trim() ? RAW_API_KEY.trim() : 'DEMO_KEY'

function formatDate(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function includesTerm(text: string | undefined, term: string) {
  if (!text) return false
  return text.toLocaleLowerCase().includes(term.toLocaleLowerCase())
}

function addDays(dateIso: string, days: number) {
  const d = new Date(`${dateIso}T00:00:00`)
  d.setDate(d.getDate() + days)
  return formatDate(d)
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function getWithRetry<T>(url: string, params: Record<string, unknown>, attempts = 3) {
  let lastErr: unknown = null
  for (let i = 0; i < attempts; i++) {
    try {
      return await axios.get<T>(url, { params })
    } catch (e) {
      lastErr = e
      const status = axios.isAxiosError(e) ? e.response?.status : undefined
      const isRetryable = status === 500 || status === 503 || status === 429
      if (!isRetryable || i === attempts - 1) break
      await sleep(1500 * Math.pow(2, i)) // 1500ms, 3000ms, 6000ms...
    }
  }
  throw lastErr
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('Saturn')
  const [query, setQuery] = useState('Saturn')
  const [daysBack, setDaysBack] = useState(20)

  const [slides, setSlides] = useState<ApodSlide[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const dateRange = useMemo(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - Math.max(1, Math.min(3650, daysBack)))
    return { start: formatDate(start), end: formatDate(end) }
  }, [daysBack])

  useEffect(() => {
    let cancelled = false

    async function run() {
      setLoading(true)
      setError('')
      setSlides([])

      try {
        const chunkDays = 15
        const allItems: ApodItem[] = []
        let cursor = dateRange.start

        while (cursor <= dateRange.end) {
          const chunkStart = cursor
          const chunkEnd = addDays(cursor, chunkDays - 1)
          const effectiveEnd = chunkEnd <= dateRange.end ? chunkEnd : dateRange.end

          const { data } = await getWithRetry<ApodItem[] | ApodItem>(
            API_URL,
            {
              api_key: API_KEY,
              start_date: chunkStart,
              end_date: effectiveEnd,
              thumbs: false,
            },
            5,
          )

          const items: ApodItem[] = Array.isArray(data) ? data : [data]
          allItems.push(...items)
          cursor = addDays(effectiveEnd, 1)
          // Evita "rajadas" de requests (rate limit / 503)
          await sleep(350)
        }

        const filtered = allItems
          .filter((i) => i.media_type === 'image')
          .filter((i) => !i.copyright)
          .filter((i) => includesTerm(i.title, query) || includesTerm(i.explanation, query))
          .sort((a, b) => b.date.localeCompare(a.date))
          .map<ApodSlide>((i) => ({
            date: i.date,
            title: i.title,
            url: i.url,
            hdurl: i.hdurl,
            explanation: i.explanation,
          }))

        if (!cancelled) setSlides(filtered)
      } catch (e) {
        if (cancelled) return
        const msg = axios.isAxiosError(e)
          ? e.response?.data?.msg || e.message
          : e instanceof Error
            ? e.message
            : 'Erro ao buscar APOD'
        setError(String(msg))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [dateRange.end, dateRange.start, query])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setQuery(searchTerm.trim() || 'Saturn')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070A12] via-[#070A12] to-[#0B1630] text-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">NASA APOD • Carrossel</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Digite um astro (ex.: <span className="font-medium text-white/80">Saturn</span>,{' '}
            <span className="font-medium text-white/80">Jupiter</span>,{' '}
            <span className="font-medium text-white/80">Orion</span>) e o app busca imagens do APOD
            que contenham o termo (título/descrição) e <span className="font-medium text-white/80">sem copyright</span>.
          </p>
        </header>

        <form onSubmit={onSubmit} className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1">
            <div className="mb-1 text-sm text-white/70">Astro / termo</div>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/25"
              placeholder="Digite um astro… (ex.: Saturn)"
            />
          </label>

          <label className="w-full sm:w-48">
            <div className="mb-1 text-sm text-white/70">Período (dias)</div>
            <input
              type="number"
              min={7}
              max={3650}
              value={daysBack}
              onChange={(e) => setDaysBack(Number(e.target.value))}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-white/25"
            />
          </label>

          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
          >
            Buscar
          </button>
        </form>

        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/70">
          <div>
            Termo: <span className="font-medium text-white/80">{query}</span>
          </div>
          <div>
            Intervalo: <span className="font-medium text-white/80">{dateRange.start}</span> até{' '}
            <span className="font-medium text-white/80">{dateRange.end}</span>
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-100">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
            Carregando imagens do APOD…
          </div>
        ) : (
          <>
            <Corrossel slides={slides} key={`${query}-${dateRange.start}-${dateRange.end}`} />
            <div className="mt-3 text-sm text-white/60">
              Resultados: <span className="font-medium text-white/80">{slides.length}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
