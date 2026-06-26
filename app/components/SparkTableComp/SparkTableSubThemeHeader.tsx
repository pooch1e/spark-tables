import SparkTableCol from './SparkTableCol';
import type { FullTree } from '@/app/types';

type SubthemeWithDescriptors = FullTree['themes'][number]['subthemes'][number];

export default function SparkTableSubthemeHeader({ subtheme }: { subtheme: SubthemeWithDescriptors }) {
  return (
    <div className="border-r last:border-r-0 border-forge-border">
      <p className="font-[family-name:var(--font-electrolize)] text-xs text-forge-muted uppercase tracking-widest bg-forge-elevated p-2 text-center border-b border-forge-border">
        {subtheme.name}
      </p>
      <SparkTableCol descriptors={subtheme.descriptors} />
    </div>
  );
}
