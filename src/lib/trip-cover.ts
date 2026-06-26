const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1534113414501-b1cebcdd3f11?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
] as const;

const DESTINATION_COVERS: Record<string, string> = {
  tokyo: COVER_IMAGES[0],
  japan: COVER_IMAGES[0],
  amalfi: COVER_IMAGES[1],
  italy: COVER_IMAGES[1],
  alps: COVER_IMAGES[2],
  switzerland: COVER_IMAGES[2],
};

export function getTripCoverImage(
  destination: string,
  coverImage?: string | null,
  fallbackIndex = 0,
): string {
  if (coverImage) {
    return coverImage;
  }

  const key = destination.toLowerCase();
  for (const [needle, url] of Object.entries(DESTINATION_COVERS)) {
    if (key.includes(needle)) {
      return url;
    }
  }

  return COVER_IMAGES[fallbackIndex % COVER_IMAGES.length];
}
