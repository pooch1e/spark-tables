import { randomNumGenerator } from '@/app/lib/utils/randomNumGenerator';

export default function SparkTableRoll({ onRoll }: { onRoll: (n: number) => void }) {
  const handleButtonClick = () => {
    onRoll(randomNumGenerator(9));
  };
  return (
    <div className="flex justify-center py-8">
      <button
        onClick={handleButtonClick}
        className="font-[family-name:var(--font-cinzel)] text-forge-gold border border-forge-gold px-10 py-3 text-sm uppercase tracking-widest hover:bg-forge-gold hover:text-forge-base transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-forge-gold focus:ring-offset-1 focus:ring-offset-forge-base">
        Cast the Table
      </button>
    </div>
  );
}
