import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-display-lg text-[2rem] leading-tight">TripSync</CardTitle>
          <CardDescription>
            Plan trips together with your crew. Sign in to access your workspaces.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              'use server';
              await signIn('google', { redirectTo: callbackUrl ?? '/trips' });
            }}
          >
            <Button type="submit" className="w-full" variant="primary">
              <span className="material-symbols-outlined text-[20px]">login</span>
              Sign in with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
