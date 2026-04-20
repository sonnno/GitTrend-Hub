'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleCollection(githubId: number): Promise<{ success: boolean; isCollected: boolean }> {
  try {
    const existing = await prisma.collection.findUnique({
      where: { githubId },
    });

    if (existing) {
      await prisma.collection.delete({
        where: { githubId },
      });
      revalidatePath('/');
      return { success: true, isCollected: false };
    } else {
      await prisma.collection.create({
        data: { githubId },
      });
      revalidatePath('/');
      return { success: true, isCollected: true };
    }
  } catch (error) {
    console.error('Error toggling collection:', error);
    throw new Error('Failed to toggle collection');
  }
}

export async function getCollectionStatus(githubId: number): Promise<boolean> {
  try {
    const existing = await prisma.collection.findUnique({
      where: { githubId },
    });
    return !!existing;
  } catch (error) {
    console.error('Error getting collection status:', error);
    return false;
  }
}
