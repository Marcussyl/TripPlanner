import { LoginDesktopPanel } from '@/components/auth/login-desktop-panel';
import { LoginFooter } from '@/components/auth/login-footer';
import { LoginHeader } from '@/components/auth/login-header';
import { LoginHeroDesktop } from '@/components/auth/login-hero-desktop';
import { LoginMobilePanel } from '@/components/auth/login-mobile-panel';

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background md:bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-24 -left-24 z-0 h-[300px] w-[300px] rounded-full bg-primary-container/20 opacity-20 blur-[100px] md:hidden"
      />

      <LoginHeader />

      <main className="relative z-10 flex flex-1 flex-col pt-16 md:flex-row md:pt-0">
        <LoginHeroDesktop />
        <LoginMobilePanel callbackUrl={callbackUrl} />
        <LoginDesktopPanel callbackUrl={callbackUrl} />
      </main>

      <LoginFooter />
    </div>
  );
}
