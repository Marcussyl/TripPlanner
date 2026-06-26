import { signIn } from '@/lib/auth';
import { GoogleIcon } from '@/components/auth/google-icon';
import { cn } from '@/lib/utils';

type LoginGoogleButtonProps = {
  callbackUrl?: string;
  variant?: 'signin' | 'outline';
  className?: string;
};

export function LoginGoogleButton({
  callbackUrl,
  variant = 'signin',
  className,
}: LoginGoogleButtonProps) {
  const isSignIn = variant === 'signin';

  return (
    <form className={className}>
      <button
        type="submit"
        formAction={async () => {
          'use server';
          await signIn('google', { redirectTo: callbackUrl ?? '/trips' });
        }}
        className={cn(
          'flex w-full items-center justify-center gap-3 transition-all active:scale-[0.98]',
          isSignIn
            ? 'rounded-lg bg-primary-container px-6 py-4 text-headline-md font-semibold text-on-primary-container shadow-lg shadow-primary-container/20 hover:brightness-90'
            : 'rounded-lg border-2 border-on-surface/10 px-6 py-3 text-label-md font-semibold text-on-surface hover:bg-surface-container-high',
        )}
      >
        <GoogleIcon />
        {isSignIn ? 'Sign in with Google' : 'Google'}
      </button>
    </form>
  );
}
