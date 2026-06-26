import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { TripAccessError } from '@/lib/auth/trip-access';

export function handleApiError(error: unknown) {
  if (error instanceof TripAccessError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error instanceof ZodError) {
    return NextResponse.json({ error: error.flatten() }, { status: 400 });
  }
  throw error;
}
