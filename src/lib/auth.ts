import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  events: {
    async signIn({ user, profile }) {
      const picture =
        profile && typeof profile === 'object' && 'picture' in profile
          ? (profile.picture as string | undefined)
          : undefined;

      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            name: user.name,
            avatarUrl: picture ?? user.image,
          },
        });
      }
    },
  },
});
