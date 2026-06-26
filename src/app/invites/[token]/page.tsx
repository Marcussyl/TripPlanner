import { InviteAcceptClient } from '@/components/trip/invite-accept-client';

type InvitePageProps = {
  params: Promise<{ token: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  return <InviteAcceptClient token={token} />;
}
