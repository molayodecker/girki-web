import type { PostHog } from 'posthog-js'

type PostHogLogAttributes = Record<string, string | number | boolean>

export function posthogLoggerInfo(
  posthog: PostHog,
  body: string,
  attributes: PostHogLogAttributes,
) {
  posthog.logger.info(body, attributes)
}
