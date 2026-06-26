import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TRIP_ID = 'seed-trip-summer-tokyo';

async function main() {
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'yuki.tanaka@example.com' },
      update: { name: 'Yuki Tanaka' },
      create: { email: 'yuki.tanaka@example.com', name: 'Yuki Tanaka' },
    }),
    prisma.user.upsert({
      where: { email: 'mia.chen@example.com' },
      update: { name: 'Mia Chen' },
      create: { email: 'mia.chen@example.com', name: 'Mia Chen' },
    }),
    prisma.user.upsert({
      where: { email: 'alex.rivera@example.com' },
      update: { name: 'Alex Rivera' },
      create: { email: 'alex.rivera@example.com', name: 'Alex Rivera' },
    }),
    prisma.user.upsert({
      where: { email: 'sam.okonkwo@example.com' },
      update: { name: 'Sam Okonkwo' },
      create: { email: 'sam.okonkwo@example.com', name: 'Sam Okonkwo' },
    }),
  ]);

  const [owner, editor, viewer, editor2] = users;
  const startDate = new Date('2026-07-10');
  const endDate = new Date('2026-07-17');

  await prisma.trip.upsert({
    where: { id: TRIP_ID },
    update: {
      name: 'Summer in Tokyo',
      destination: 'Tokyo, Japan',
      startDate,
      endDate,
      budgetLimit: 5000,
    },
    create: {
      id: TRIP_ID,
      name: 'Summer in Tokyo',
      destination: 'Tokyo, Japan',
      startDate,
      endDate,
      budgetLimit: 5000,
    },
  });

  for (const [userId, role] of [
    [owner.id, 'owner'],
    [editor.id, 'editor'],
    [viewer.id, 'viewer'],
    [editor2.id, 'editor'],
  ] as const) {
    await prisma.tripMember.upsert({
      where: { tripId_userId: { tripId: TRIP_ID, userId } },
      update: { role },
      create: { tripId: TRIP_ID, userId, role },
    });
  }

  await prisma.vote.deleteMany({ where: { pollOption: { poll: { tripId: TRIP_ID } } } });
  await prisma.pollOption.deleteMany({ where: { poll: { tripId: TRIP_ID } } });
  await prisma.poll.deleteMany({ where: { tripId: TRIP_ID } });
  await prisma.expenseSplit.deleteMany({ where: { expense: { tripId: TRIP_ID } } });
  await prisma.expense.deleteMany({ where: { tripId: TRIP_ID } });
  await prisma.chatMessage.deleteMany({ where: { tripId: TRIP_ID } });
  await prisma.canvasPin.deleteMany({ where: { tripId: TRIP_ID } });
  await prisma.activity.deleteMany({ where: { day: { tripId: TRIP_ID } } });
  await prisma.itineraryDay.deleteMany({ where: { tripId: TRIP_ID } });

  const day1 = await prisma.itineraryDay.create({
    data: {
      tripId: TRIP_ID,
      dayNumber: 1,
      date: new Date('2026-07-10'),
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
          {
            type: 'transport',
            title: 'Train to Shibuya',
            startTime: new Date('2026-07-10T16:00:00'),
            duration: 45,
            lat: 35.658,
            lng: 139.7016,
          },
        ],
      },
    },
  });

  const day2 = await prisma.itineraryDay.create({
    data: {
      tripId: TRIP_ID,
      dayNumber: 2,
      date: new Date('2026-07-11'),
      label: 'Shibuya & Harajuku',
      activities: {
        create: [
          {
            type: 'activity',
            title: 'Meiji Shrine',
            startTime: new Date('2026-07-11T09:00:00'),
            duration: 120,
            lat: 35.6764,
            lng: 139.6993,
          },
          {
            type: 'activity',
            title: 'Takeshita Street',
            startTime: new Date('2026-07-11T10:30:00'),
            duration: 90,
            lat: 35.6717,
            lng: 139.7036,
          },
          {
            type: 'activity',
            title: 'Ramen lunch',
            startTime: new Date('2026-07-11T12:30:00'),
            duration: 60,
            lat: 35.6595,
            lng: 139.7005,
          },
        ],
      },
    },
  });

  void day1;
  void day2;

  await prisma.chatMessage.createMany({
    data: [
      {
        tripId: TRIP_ID,
        userId: owner.id,
        content: 'Welcome everyone! So excited for Tokyo 🗼',
      },
      {
        tripId: TRIP_ID,
        userId: editor.id,
        content: 'Should we book teamLab tickets early?',
      },
      {
        tripId: TRIP_ID,
        userId: editor2.id,
        content: 'I found a great izakaya near Shibuya — pinning it!',
      },
    ],
  });

  await prisma.canvasPin.createMany({
    data: [
      {
        tripId: TRIP_ID,
        type: 'link',
        category: 'idea',
        createdById: editor2.id,
        content: JSON.stringify({
          url: 'https://www.timeout.com/tokyo/restaurants/best-izakaya-tokyo',
          title: 'Best izakaya in Tokyo',
          description: 'Shortlist for our first night out',
        }),
      },
      {
        tripId: TRIP_ID,
        type: 'note',
        category: 'idea',
        createdById: editor.id,
        content: JSON.stringify({
          title: 'Day 2 ideas',
          bullets: ['teamLab Planets', 'Harajuku crepes', 'Shibuya crossing at night'],
        }),
      },
      {
        tripId: TRIP_ID,
        type: 'link',
        category: null,
        createdById: owner.id,
        content: JSON.stringify({
          url: 'https://www.japan.travel/en/spot/123/',
          title: 'Meiji Shrine guide',
          description: 'Opening hours and etiquette',
        }),
      },
    ],
  });

  const poll = await prisma.poll.create({
    data: {
      tripId: TRIP_ID,
      question: 'Which area for dinner on Day 1?',
      createdById: owner.id,
      options: {
        create: [{ label: 'Shibuya' }, { label: 'Shinjuku' }, { label: 'Roppongi' }],
      },
    },
    include: { options: true },
  });

  await prisma.vote.create({
    data: {
      pollOptionId: poll.options[0].id,
      userId: owner.id,
    },
  });

  const members = [owner, editor, editor2, viewer];
  const splitAmount = 37.5;

  await prisma.expense.create({
    data: {
      tripId: TRIP_ID,
      title: 'Airport train passes',
      amount: 150,
      category: 'transport',
      payerId: owner.id,
      splits: {
        create: members.map((member) => ({
          userId: member.id,
          amount: splitAmount,
        })),
      },
    },
  });

  await prisma.expense.create({
    data: {
      tripId: TRIP_ID,
      title: 'Welcome dinner',
      amount: 280,
      category: 'food',
      payerId: editor.id,
      splits: {
        create: members.map((member) => ({
          userId: member.id,
          amount: 70,
        })),
      },
    },
  });

  console.log('Seeded trip: Summer in Tokyo (4 members, 2 days, chat, pins, poll, expenses)');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
