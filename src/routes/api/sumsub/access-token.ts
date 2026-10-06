import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/sumsub/access-token')({
  server: {
    handlers: {
      POST: async () => {
        try {
          const { requireSupabaseUser } = await import('../../../lib/supabase/server')
          const { user } = await requireSupabaseUser()

          const { sql } = await import('../../../lib/db.server')
          const chef = await sql<{ id: string | number }[]>`
            select id from public.chef_profiles
            where user_id = ${user.id}
            limit 1
          `
          if (!chef[0]) {
            return Response.json(
              { error: 'Start your chef application before identity verification.' },
              { status: 400 },
            )
          }

          const { mintChefAccessToken } = await import('../../../lib/sumsub.server')
          const token = await mintChefAccessToken(user.id)
          return Response.json(token)
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unable to mint Sumsub token.'
          const status = message.includes('Unauthorized') ? 401 : 500
          return Response.json({ error: message }, { status })
        }
      },
    },
  },
})
