import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function toISODate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseISODate(value: string) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function formatDisplay(value: string) {
  const date = parseISODate(value)
  if (!date) return ''
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function monthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const startOffset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells: Array<{ date: Date; inMonth: boolean }> = []

  for (let i = startOffset; i > 0; i -= 1) {
    cells.push({
      date: new Date(month.getFullYear(), month.getMonth(), 1 - i),
      inMonth: false,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      date: new Date(month.getFullYear(), month.getMonth(), day),
      inMonth: true,
    })
  }

  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date
    cells.push({
      date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
      inMonth: false,
    })
  }

  return cells
}

export default function DatePicker({
  value,
  onChange,
  name = 'date',
  compact = false,
  minDate,
  tone = 'light',
}: {
  value: string
  onChange: (value: string) => void
  name?: string
  compact?: boolean
  minDate?: string
  tone?: 'light' | 'dark'
}) {
  const dark = tone === 'dark'
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const selected = parseISODate(value)
  const [visibleMonth, setVisibleMonth] = useState(
    () => selected ?? startOfDay(new Date()),
  )

  useEffect(() => {
    const next = parseISODate(value)
    if (next) setVisibleMonth(next)
  }, [value])

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const today = startOfDay(new Date())
  const minimum = parseISODate(minDate ?? toISODate(today)) ?? today
  const cells = useMemo(() => monthGrid(visibleMonth), [visibleMonth])
  const monthLabel = visibleMonth.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  })

  function selectDate(date: Date) {
    if (startOfDay(date) < minimum) return
    onChange(toISODate(date))
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative min-w-0">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        aria-label="Choose a date"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center gap-3 text-left ${compact ? '' : 'min-h-16'}`}
      >
        {compact ? null : (
          <CalendarDays size={16} className="shrink-0 text-ploy-accent-tertiary" aria-hidden="true" />
        )}
        <span className="min-w-0 flex-1">
          {compact ? null : <span className="typography-eyebrow block">When</span>}
          <span
            className={`block truncate ${compact ? 'min-h-14 py-4 text-base' : 'mt-1 text-sm'} ${
              value
                ? dark
                  ? 'text-white'
                  : 'text-ploy-text-primary'
                : dark
                  ? 'text-white/45'
                  : 'text-ploy-text-secondary'
            }`}
          >
            {value ? formatDisplay(value) : 'Add a date'}
          </span>
        </span>
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+0.45rem)] z-50 w-[18.5rem] rounded-[1.4rem] border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-4 text-ploy-text-primary shadow-[var(--shadow-lift)]">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-heading text-lg tracking-tight">{monthLabel}</p>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="Previous month"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-ploy-background-secondary"
                onClick={() =>
                  setVisibleMonth(
                    new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
                  )
                }
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next month"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-ploy-background-secondary"
                onClick={() =>
                  setVisibleMonth(
                    new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
                  )
                }
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAYS.map((day) => (
              <span key={day} className="typography-eyebrow py-1 text-[0.62rem]">
                {day}
              </span>
            ))}
            {cells.map(({ date, inMonth }) => {
              const iso = toISODate(date)
              const isSelected = value === iso
              const isToday = toISODate(today) === iso
              const disabled = startOfDay(date) < minimum

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDate(date)}
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                    isSelected
                      ? 'bg-ploy-accent-secondary text-white'
                      : isToday
                        ? 'ring-1 ring-ploy-accent-tertiary'
                        : 'hover:bg-ploy-background-secondary'
                  } ${inMonth ? '' : 'text-ploy-text-secondary/50'} ${
                    disabled ? 'cursor-not-allowed opacity-35 hover:bg-transparent' : ''
                  }`}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-ploy-border-primary pt-3">
            <button
              type="button"
              className="text-xs tracking-[0.12em] uppercase text-ploy-text-secondary"
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
            >
              Clear
            </button>
            <button
              type="button"
              className="text-xs tracking-[0.12em] uppercase text-ploy-accent-secondary"
              onClick={() => selectDate(today < minimum ? minimum : today)}
            >
              Today
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
