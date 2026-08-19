import { createFileRoute } from '@tanstack/react-router'
import { twilioSignatureIsValid } from '../../lib/twilio-signature.server'

function twiml(message: string) {
  const escaped = message
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
  return `<?xml version="1.0" encoding="UTF-8"?><Response>${
    escaped ? `<Message>${escaped}</Message>` : ''
  }</Response>`
}

function bearerToken(request: Request) {
  const header = request.headers.get('authorization') ?? ''
  return header.startsWith('Bearer ') ? header.slice(7).trim() : ''
}

export const Route = createFileRoute('/api/whatsapp')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const contentType = request.headers.get('content-type') ?? ''
        const notify = await import('../../lib/chef-notify.server')

        if (contentType.includes('application/json')) {
          const secret = process.env.WHATSAPP_WEBHOOK_SECRET
          if (!secret || bearerToken(request) !== secret) {
            return new Response('Unauthorized', { status: 401 })
          }
          const payload = (await request.json()) as { from?: string; body?: string }
          const result = await notify.applyWhatsAppReply(
            String(payload.from ?? ''),
            String(payload.body ?? ''),
          )
          return Response.json(result)
        }

        const form = await request.formData()
        const params: Record<string, string> = {}
        for (const [key, value] of form.entries()) {
          if (typeof value === 'string') params[key] = value
        }
        const signedUrl = process.env.TWILIO_WEBHOOK_URL ?? request.url
        const signature = request.headers.get('x-twilio-signature') ?? ''
        if (!twilioSignatureIsValid(signedUrl, params, signature)) {
          return new Response('Unauthorized', { status: 401 })
        }

        const result = await notify.applyWhatsAppReply(
          params.From ?? params.from ?? '',
          params.Body ?? params.body ?? '',
        )
        return new Response(twiml(result.reply), {
          headers: { 'Content-Type': 'text/xml; charset=utf-8' },
        })
      },
    },
  },
})
