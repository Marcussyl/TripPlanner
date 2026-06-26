'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-label-md text-on-surface-variant hover:bg-surface-container hover:text-error"
    >
      <span className="material-symbols-outlined text-[20px]">logout</span>
      Sign out
    </button>
  );
}
