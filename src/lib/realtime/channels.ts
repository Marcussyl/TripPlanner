export function tripPresenceChannel(tripId: string) {
  return `presence-trip-${tripId}`;
}

export function tripPrivateChannel(tripId: string) {
  return `private-trip-${tripId}`;
}

export function parsePresenceChannel(channelName: string): string | null {
  const match = channelName.match(/^presence-trip-(.+)$/);
  return match?.[1] ?? null;
}
