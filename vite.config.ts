import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'

  return {
    resolve: { tsconfigPaths: true },
    optimizeDeps: {
      // Vite's prebundle drops seroval's isStream export, which blocks client hydration.
      exclude: ['seroval'],
    },
    ssr: {
      noExternal: ['posthog-js', '@posthog/react'],
    },
    plugins: [
      ...(isProduction ? [] : [devtools()]),
      tailwindcss(),
      tanstackStart(),
      nitro(),
      viteReact(),
    ],
    define: {
      'import.meta.env.VITE_SHOWCASE_ONLY_CHEFS': JSON.stringify(
        env.SHOWCASE_ONLY_CHEFS ?? env.VITE_SHOWCASE_ONLY_CHEFS ?? 'false',
      ),
    },
  }
})
