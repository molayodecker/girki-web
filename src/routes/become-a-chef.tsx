import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import PhoneContinueForm from '../components/auth/PhoneContinueForm'
import PageShell, { PageIntro } from '../components/layout/PageShell'
import { sendPhoneOtp, setSignupIntent } from '../lib/auth-client'

export const Route = createFileRoute('/become-a-chef')({
  component: BecomeAChefPage,
})

function BecomeAChefPage() {
  const navigate = useNavigate()

  return (
    <PageShell tone="sand">
      <main className="section-pad">
        <div className="mx-auto max-w-md">
          <PageIntro
            eyebrow="Become a Girki chef"
            title="Start with your phone."
            copy="Verify your number first. You’ll stay a customer account until Girki reviews your chef application — roles are never set from the browser."
          />
          <div className="mt-10 rounded-[1.8rem] border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-6 sm:p-8">
            <PhoneContinueForm
              submitLabel="Continue to verification"
              onSubmit={async ({ phone }) => {
                setSignupIntent('chef')
                await sendPhoneOtp(phone)
                await navigate({ to: '/verify-phone' })
              }}
            />
            <p className="mt-6 text-sm text-ploy-text-secondary">
              Already cooking with us?{' '}
              <Link to="/sign-in" className="underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </PageShell>
  )
}
