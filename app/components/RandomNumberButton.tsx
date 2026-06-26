'use client';
import { useRouter } from 'next/navigation';
import { randomNumGenerator } from '../lib/utils/randomNumGenerator';

export default function RandomNumberButton() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(`/topics/${randomNumGenerator(4)}`);
  };

  return (
    <div className="flex justify-center py-6">
      <button
        onClick={handleButtonClick}
        className="font-[family-name:var(--font-cinzel)] text-forge-muted border border-forge-border px-8 py-3 text-xs uppercase tracking-widest hover:border-forge-gold/50 hover:text-forge-gold transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-forge-border">
        Random Table
      </button>
    </div>
  );
}
