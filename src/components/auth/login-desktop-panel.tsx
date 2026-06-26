import { LoginGoogleButton } from '@/components/auth/login-google-button';

type LoginDesktopPanelProps = {
  callbackUrl?: string;
};

export function LoginDesktopPanel({ callbackUrl }: LoginDesktopPanelProps) {
  return (
    <section className="hidden w-full flex-1 items-center justify-center bg-surface px-4 py-10 md:flex md:w-1/2 md:px-12 md:py-16">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2">
          <h1 className="text-[40px] font-extrabold leading-tight tracking-tight text-on-surface">
            Welcome back, Explorer
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Enter your details to pick up where you left off.
          </p>
        </div>

        <div className="space-y-6">
          <p className="text-body-md text-on-surface-variant">
            TripSync uses Google sign-in to access your shared trip workspaces.
          </p>

          <LoginGoogleButton callbackUrl={callbackUrl} variant="signin" />
        </div>

        <p className="text-center text-body-md text-on-surface-variant">
          New to TripSync?{' '}
          <span className="font-semibold text-primary">Ask your trip owner for an invite link.</span>
        </p>
      </div>
    </section>
  );
}
