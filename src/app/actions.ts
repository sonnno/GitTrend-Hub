'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { Prisma } from '@prisma/client';

type CollectionIdResult = Prisma.CollectionGetPayload<{
  select: { githubId: true };
}>;

export async function toggleCollection(githubId: number): Promise<boolean> {
  if (typeof githubId !== 'number') {
    throw new Error('Invalid githubId');
  }

  const existing = await prisma.collection.findUnique({
    where: { githubId },
  });

  if (existing) {
    await prisma.collection.delete({
      where: { githubId },
    });
    revalidatePath('/');
    return false;
  } else {
    await prisma.collection.create({
      data: { githubId },
    });
    revalidatePath('/');
    return true;
  }
}

export async function getCollectedIds(): Promise<number[]> {
  const collections = await prisma.collection.findMany({
    select: { githubId: true },
  });
  return collections.map((c: CollectionIdResult) => c.githubId);
}
