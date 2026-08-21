import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  emailPasswordSchema,
  type EmailPasswordValues,
} from '../../lib/validation/auth'

export default function EmailAuthForm({
  onSignIn,
  onSignUp,
}: {
  onSignIn: (values: EmailPasswordValues) => Promise<void>
  onSignUp: (values: EmailPasswordValues) => Promise<void>
}) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<EmailPasswordValues>({
    resolver: zodResolver(emailPasswordSchema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        try {
          if (mode === 'signin') await onSignIn(values)
          else await onSignUp(values)
        } catch (error) {
          setError('email', {
            message: error instanceof Error ? error.message : 'Unable to continue.',
          })
        }
      })}
    >
      <div className="flex gap-2 text-sm">
        <button
          type="button"
          className={`rounded-full px-3 py-1 ${
            mode === 'signin'
              ? 'bg-ploy-accent-primary text-ploy-text-on-accent-primary'
              : 'text-ploy-text-secondary'
          }`}
          onClick={() => setMode('signin')}
        >
          Sign in
        </button>
        <button
          type="button"
          className={`rounded-full px-3 py-1 ${
            mode === 'signup'
              ? 'bg-ploy-accent-primary text-ploy-text-on-accent-primary'
              : 'text-ploy-text-secondary'
          }`}
          onClick={() => setMode('signup')}
        >
          Create account
        </button>
      </div>

      <label className="block">
        <span className="text-sm text-ploy-text-secondary">Email</span>
        <input
          type="email"
          autoComplete="email"
          className="mt-2 min-h-12 w-full rounded-xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 px-4 outline-none focus:border-ploy-accent-tertiary"
          {...register('email')}
        />
        {errors.email ? (
          <p className="mt-2 text-sm text-ploy-accent-secondary">{errors.email.message}</p>
        ) : null}
      </label>

      <label className="block">
        <span className="text-sm text-ploy-text-secondary">Password</span>
        <input
          type="password"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          className="mt-2 min-h-12 w-full rounded-xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 px-4 outline-none focus:border-ploy-accent-tertiary"
          {...register('password')}
        />
        {errors.password ? (
          <p className="mt-2 text-sm text-ploy-accent-secondary">{errors.password.message}</p>
        ) : null}
      </label>

      <button type="submit" className="btn btn-primary min-h-11 w-full" disabled={isSubmitting}>
        {isSubmitting
          ? mode === 'signin'
            ? 'Signing in…'
            : 'Creating account…'
          : mode === 'signin'
            ? 'Sign in with email'
            : 'Create account'}
      </button>
    </form>
  )
}
