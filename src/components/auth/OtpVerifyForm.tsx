import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otpSchema, type OtpFormValues } from '../../lib/validation/auth'

export default function OtpVerifyForm({
  onSubmit,
  onResend,
}: {
  onSubmit: (values: OtpFormValues) => Promise<void>
  onResend?: () => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  })

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(async (values) => {
        try {
          await onSubmit(values)
        } catch (error) {
          setError('otp', {
            message: error instanceof Error ? error.message : 'Unable to verify that code.',
          })
        }
      })}
    >
      <label className="block">
        <span className="text-sm text-ploy-text-secondary">Verification code</span>
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          className="mt-2 min-h-12 w-full rounded-xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 px-4 text-center font-heading text-2xl tracking-[0.35em] outline-none focus:border-ploy-accent-tertiary"
          {...register('otp')}
        />
        {errors.otp ? (
          <p className="mt-2 text-sm text-ploy-accent-secondary">{errors.otp.message}</p>
        ) : null}
      </label>

      <button type="submit" className="btn btn-primary min-h-11 w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Verifying…' : 'Verify'}
      </button>

      {onResend ? (
        <button
          type="button"
          className="w-full text-sm text-ploy-text-secondary underline-offset-4 hover:underline"
          onClick={() => void onResend()}
        >
          Resend code
        </button>
      ) : null}
    </form>
  )
}
