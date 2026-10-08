/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_SHOWCASE_ONLY_CHEFS: string
  readonly VITE_MEDIA_CDN: string
  readonly VITE_POSTHOG_KEY: string
  readonly VITE_POSTHOG_HOST: string
  readonly VITE_POSTHOG_DEV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
