import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import {
  phoneSchema,
  type PhoneFormValues,
} from '../../lib/validation/auth'
import {
  isMockPhoneLoginEnabled,
  MOCK_PHONE,
  MOCK_PHONE_DISPLAY,
  MOCK_OTP,
} from '../../lib/auth-mock'

export default function PhoneContinueForm({
  submitLabel = 'Continue',
  onSubmit,
}: {
  submitLabel?: string
  onSubmit: (values: PhoneFormValues) => Promise<void>
}) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: isMockPhoneLoginEnabled() ? MOCK_PHONE : '' },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        try {
          await onSubmit(values)
        } catch (error) {
          setError('phone', {
            message: error instanceof Error ? error.message : 'Unable to continue.',
          })
        }
      })}
    >
      <label className="block">
        <span className="mb-2 block text-sm text-ploy-text-secondary">Mobile number</span>
        <div className="phone-field flex min-h-12 items-center rounded-xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 px-3.5 focus-within:border-ploy-accent-tertiary">
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <PhoneInput
                international
                defaultCountry="GH"
                value={field.value}
                onChange={(value) => field.onChange(value ?? '')}
                onBlur={field.onBlur}
                className="PhoneInputGirki w-full"
              />
            )}
          />
        </div>
        {errors.phone ? (
          <p className="mt-2 text-sm text-ploy-accent-secondary">{errors.phone.message}</p>
        ) : isMockPhoneLoginEnabled() ? (
          <p className="mt-2 text-xs leading-relaxed text-ploy-text-secondary">
            Mock login: use {MOCK_PHONE_DISPLAY}. The code is {MOCK_OTP}.
          </p>
        ) : null}
      </label>

      <button type="submit" className="btn btn-primary min-h-12 w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Sending code…' : submitLabel}
      </button>
    </form>
  )
}
