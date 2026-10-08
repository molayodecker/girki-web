import { logs } from '@opentelemetry/api-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs'

type PostHogLogAttributes = Record<string, string | number | boolean>

let logger: ReturnType<typeof logs.getLogger> | null = null
let sdk: NodeSDK | null = null

function getPostHogServerLogger() {
  const key = import.meta.env.VITE_POSTHOG_KEY?.trim()
  const host = import.meta.env.VITE_POSTHOG_HOST?.trim().replace(/\/$/, '')

  if (!key || !host) {
    if (import.meta.env.DEV) {
      const variable = key ? 'VITE_POSTHOG_HOST' : 'VITE_POSTHOG_KEY'
      throw new Error(
        `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
      )
    }
    return null
  }

  if (!logger) {
    sdk = new NodeSDK({
      resource: resourceFromAttributes({
        'service.name': 'girki-web-server',
        'deployment.environment': import.meta.env.MODE,
      }),
      logRecordProcessors: [
        new BatchLogRecordProcessor({
          exporter: new OTLPLogExporter({
            url: `${host}/i/v1/logs`,
            headers: { Authorization: `Bearer ${key}` },
          }),
        }),
      ],
    })
    sdk.start()
    logger = logs.getLogger('girki-web-posthog')
  }

  return logger
}

export function posthogServerLoggerInfo(body: string, attributes: PostHogLogAttributes) {
  getPostHogServerLogger()?.emit({
    severityText: 'INFO',
    body,
    attributes,
  })
}
