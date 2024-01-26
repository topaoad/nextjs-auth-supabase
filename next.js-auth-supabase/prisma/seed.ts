import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: 'alice@prisma.io',
      name: 'Alice',
    },
    {
      email: 'bob@prisma.io',
      name: 'Bob',
    },
    {
      email: 'taro@prisma.io',
      name: 'Taro',
    },
    // 他のユーザー情報を追加...
  ];

  // トランザクションを使用して複数のupsertを同時に実行
  const upsertUsers = await prisma.$transaction(
    users.map(user =>
      prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: user,
      })
    )
  );

  console.log(upsertUsers);

  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
    },
  });

  const post = await prisma.post.create({
    data: {
      title: 'First Post',
      content: 'This is the second post.',
      published: true,
      authorId: alice.id,
    },
  });

  console.log({ alice, post });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });