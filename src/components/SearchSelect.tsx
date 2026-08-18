import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export default function SearchSelect({
  name,
  label,
  value,
  options,
  onChange,
  icon,
  tone = 'light',
}: {
  name: string
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  icon?: ReactNode
  tone?: 'light' | 'dark'
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const dark = tone === 'dark'

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return (
    <div ref={rootRef} className="relative min-w-0">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-3 text-left"
      >
        {icon}
        <span className="min-w-0 flex-1">
          <span className="typography-eyebrow block">{label}</span>
          <span
            className={`mt-1 flex items-center justify-between gap-2 text-sm ${
              dark ? 'text-white' : 'text-ploy-text-primary'
            }`}
          >
            <span className="truncate">{value}</span>
            <ChevronDown size={14} className={dark ? 'text-white/50' : 'text-ploy-text-secondary'} />
          </span>
        </span>
      </button>
      {open ? (
        <ul className="absolute left-0 right-0 top-[calc(100%+0.55rem)] z-50 overflow-hidden rounded-2xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 py-2 text-ploy-text-primary shadow-[var(--shadow-lift)]">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                className={`flex w-full px-4 py-2.5 text-left text-sm hover:bg-ploy-background-secondary ${
                  option === value ? 'text-ploy-accent-secondary' : ''
                }`}
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
