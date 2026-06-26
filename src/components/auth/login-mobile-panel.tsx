import { LoginGoogleButton } from '@/components/auth/login-google-button';
import { LoginHeroMobile } from '@/components/auth/login-hero-mobile';

type LoginMobilePanelProps = {
  callbackUrl?: string;
};

export function LoginMobilePanel({ callbackUrl }: LoginMobilePanelProps) {
  return (
    <div className="flex w-full flex-col items-center px-4 pb-10 pt-6 md:hidden">
      <LoginHeroMobile />

      <p className="mb-6 w-full max-w-sm text-center text-body-md text-on-surface-variant">
        Sign in with your Google account to access shared trips and invites.
      </p>

      <LoginGoogleButton callbackUrl={callbackUrl} variant="outline" className="w-full max-w-sm" />

      <p className="mt-10 w-full max-w-sm text-center text-body-md text-on-surface-variant">
        Got an invite?{' '}
        <span className="font-bold text-primary">Use your trip owner&apos;s link</span>
      </p>
    </div>
  );
}
