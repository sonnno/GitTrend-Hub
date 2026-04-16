'use client';

import { useOptimistic, useTransition } from 'react';
import { toggleCollection } from '@/app/actions';

interface CollectButtonProps {
  githubId: number;
  initialCollected: boolean;
}

export function CollectButton({ githubId, initialCollected }: CollectButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticCollected, setOptimisticCollected] = useOptimistic(initialCollected);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      const newValue = !optimisticCollected;
      setOptimisticCollected(newValue);
      await toggleCollection(githubId);
    });
  };

  return (
    <button
      className={`collect-btn ${optimisticCollected ? 'collected' : ''}`}
      onClick={handleToggle}
      disabled={isPending}
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={optimisticCollected ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
