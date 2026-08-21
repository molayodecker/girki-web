import { createFileRoute } from '@tanstack/react-router'
import type { SumsubWebhookEvent } from '../../../lib/sumsub.server'

export const Route = createFileRoute('/api/sumsub/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = Buffer.from(await request.arrayBuffer())
        const digest = request.headers.get('x-payload-digest')
        const alg = request.headers.get('x-payload-digest-alg')

        try {
          const { verifySumsubWebhook } = await import('../../../lib/sumsub.server')
          if (!verifySumsubWebhook(raw, digest, alg)) {
            return new Response('invalid signature', { status: 401 })
          }
        } catch (error) {
          console.error('Sumsub webhook config error', error)
          return new Response('webhook not configured', { status: 500 })
        }

        let event: SumsubWebhookEvent
        try {
          event = JSON.parse(raw.toString('utf8')) as SumsubWebhookEvent
        } catch {
          return new Response('invalid json', { status: 400 })
        }

        // Acknowledge quickly; process after parse.
        try {
          await handleSumsubEvent(event)
        } catch (error) {
          console.error('Sumsub webhook handler failed', error)
          // Still 200 to avoid endless retries on permanent data issues;
          // Sumsub will retry on non-2xx. Log for ops.
          return new Response('handler error', { status: 500 })
        }

        return new Response(null, { status: 200 })
      },
    },
  },
})

async function handleSumsubEvent(event: SumsubWebhookEvent) {
  if (event.type !== 'applicantReviewed' && event.type !== 'applicantWorkflowCompleted') {
    return
  }

  const externalUserId = event.externalUserId
  if (!externalUserId) {
    console.warn('Sumsub event missing externalUserId', event.type, event.applicantId)
    return
  }

  const answer = event.reviewResult?.reviewAnswer
  if (!answer) return

  const { sql } = await import('../../../lib/db.server')
  await sql`
    select private.apply_chef_sumsub_review(
      ${externalUserId}::uuid,
      ${event.applicantId ?? null},
      ${answer},
      ${event.reviewResult?.reviewRejectType ?? null},
      ${event.reviewResult?.rejectLabels ?? []}
    )
  `
}
