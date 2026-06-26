import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'yuki.tanaka@example.com' },
      update: { name: 'Yuki Tanaka', avatarUrl: null },
      create: { email: 'yuki.tanaka@example.com', name: 'Yuki Tanaka' },
    }),
    prisma.user.upsert({
      where: { email: 'mia.chen@example.com' },
      update: { name: 'Mia Chen', avatarUrl: null },
      create: { email: 'mia.chen@example.com', name: 'Mia Chen' },
    }),
    prisma.user.upsert({
      where: { email: 'alex.rivera@example.com' },
      update: { name: 'Alex Rivera', avatarUrl: null },
      create: { email: 'alex.rivera@example.com', name: 'Alex Rivera' },
    }),
    prisma.user.upsert({
      where: { email: 'sam.okonkwo@example.com' },
      update: { name: 'Sam Okonkwo', avatarUrl: null },
      create: { email: 'sam.okonkwo@example.com', name: 'Sam Okonkwo' },
    }),
  ]);

  const [owner, editor, viewer, editor2] = users;

  const startDate = new Date('2026-07-10');
  const endDate = new Date('2026-07-17');

  const trip = await prisma.trip.upsert({
    where: { id: 'seed-trip-summer-tokyo' },
    update: {
      name: 'Summer in Tokyo',
      destination: 'Tokyo, Japan',
      startDate,
      endDate,
      budgetLimit: 5000,
    },
    create: {
      id: 'seed-trip-summer-tokyo',
      name: 'Summer in Tokyo',
      destination: 'Tokyo, Japan',
      startDate,
      endDate,
      budgetLimit: 5000,
      members: {
        create: [
          { userId: owner.id, role: 'owner' },
          { userId: editor.id, role: 'editor' },
          { userId: viewer.id, role: 'viewer' },
          { userId: editor2.id, role: 'editor' },
        ],
      },
      itineraryDays: {
        create: [
          {
            dayNumber: 1,
            date: startDate,
            label: 'Arrival',
            activities: {
              create: [
                {
                  type: 'flight',
                  title: 'Land at Haneda',
                  startTime: new Date('2026-07-10T14:30:00'),
                  duration: 90,
                  lat: 35.5494,
                  lng: 139.7798,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      members: true,
      itineraryDays: { include: { activities: true } },
    },
  });

  console.log('Seeded trip:', trip.name, `(${trip.members.length} members)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
