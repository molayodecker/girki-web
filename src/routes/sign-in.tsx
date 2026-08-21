import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import PhoneContinueForm from '../components/auth/PhoneContinueForm'
import PageShell, { PageIntro } from '../components/layout/PageShell'
import { sendPhoneOtp, setSignupIntent } from '../lib/auth-client'

export const Route = createFileRoute('/sign-in')({
  component: SignInPage,
})

function SignInPage() {
  const navigate = useNavigate()

  return (
    <PageShell>
      <main className="section-pad">
        <div className="mx-auto max-w-md">
          <PageIntro
            eyebrow="Continue with phone"
            title="Welcome to Girki."
            copy="Enter your mobile number. We’ll text a 6-digit code — no password to invent or forget."
          />
          <div className="mt-10 rounded-[1.8rem] border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-6 sm:p-8">
            <PhoneContinueForm
              onSubmit={async ({ phone }) => {
                setSignupIntent('customer')
                await sendPhoneOtp(phone)
                await navigate({ to: '/verify-phone' })
              }}
            />
            <p className="mt-6 text-sm leading-relaxed text-ploy-text-secondary">
              By continuing you agree to Girki’s terms. SMS rates may apply. New accounts start as
              customers; chefs apply separately after verifying.
            </p>
            <p className="mt-4 text-sm text-ploy-text-secondary">
              Want to cook with Girki?{' '}
              <Link to="/become-a-chef" className="underline underline-offset-4">
                Become a chef
              </Link>
            </p>
          </div>
        </div>
      </main>
    </PageShell>
  )
}
