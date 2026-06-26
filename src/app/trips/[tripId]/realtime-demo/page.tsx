import { RealtimeDemoClient } from '@/components/trip/realtime-demo-client';

type RealtimeDemoPageProps = {
  params: Promise<{ tripId: string }>;
};

export default async function RealtimeDemoPage({ params }: RealtimeDemoPageProps) {
  const { tripId } = await params;
  return <RealtimeDemoClient tripId={tripId} />;
}
