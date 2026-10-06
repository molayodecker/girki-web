import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snsWebSdk?: any
  }
}

type Props = {
  email?: string
  phone?: string
  onSubmitted?: () => void
  onError?: (message: string) => void
}

async function fetchAccessToken(): Promise<string> {
  const response = await fetch('/api/sumsub/access-token', { method: 'POST' })
  const body = (await response.json()) as { token?: string; error?: string }
  if (!response.ok || !body.token) {
    throw new Error(body.error || `Unable to start verification (${response.status})`)
  }
  return body.token
}

function loadSumsubScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.snsWebSdk) return Promise.resolve()
  const src = 'https://static.sumsub.com/idensic/static/sns-websdk-builder.js'
  const existing = document.querySelector(`script[src="${src}"]`)
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load Sumsub SDK')))
    })
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Sumsub SDK'))
    document.head.appendChild(script)
  })
}

export default function SumsubWebSdk({ email, phone, onSubmitted, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        await loadSumsubScript()
        if (cancelled || !window.snsWebSdk || !containerRef.current) return

        const initialToken = await fetchAccessToken()
        if (cancelled) return

        const sdk = window.snsWebSdk
          .init(initialToken, () => fetchAccessToken())
          .withConf({
            lang: 'en',
            theme: 'light',
            email,
            phone,
          })
          .withOptions({
            addViewportTag: false,
            adaptIframeHeight: true,
          })
          .on('idCheck.onReady', () => {
            if (!cancelled) setReady(true)
          })
          .on('idCheck.onApplicantSubmitted', () => {
            onSubmitted?.()
          })
          .on('idCheck.onError', (payload: unknown) => {
            const message =
              payload && typeof payload === 'object' && 'message' in payload
                ? String((payload as { message: unknown }).message)
                : 'Verification hit an error. Try again.'
            setError(message)
            onError?.(message)
          })
          .build()

        if (!cancelled && containerRef.current) {
          sdk.launch(containerRef.current)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to start Sumsub.'
        if (!cancelled) {
          setError(message)
          onError?.(message)
        }
      }
    })()

    return () => {
      cancelled = true
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [email, phone, onSubmitted, onError])

  return (
    <div className="relative min-h-[600px] overflow-hidden rounded-[1.4rem] border border-ploy-border-primary bg-ploy-neutral-primary-s0">
      {!ready && !error ? (
        <div className="absolute inset-0 z-10 grid place-items-center bg-ploy-neutral-primary-s0 text-sm text-ploy-text-secondary">
          Loading identity verification…
        </div>
      ) : null}
      {error ? (
        <div className="absolute inset-0 z-10 grid place-items-center px-6 text-center text-sm text-ploy-accent-secondary">
          {error}
        </div>
      ) : null}
      <div ref={containerRef} />
    </div>
  )
}
