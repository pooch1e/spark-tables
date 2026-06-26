'use client';
import SparkTableHeader from './SparkTableHeader';
import SparkTableRoll from './SparkTableRoll';
import SparkTableSubthemeHeader from './SparkTableSubThemeHeader';
import { FullTree } from '@/app/types';
import { useState, useRef, useEffect } from 'react';

export default function SparkTable({ data }: { data: FullTree[] }) {
  const [tableRollNumber, setTableRollNumber] = useState<number | null>(null);
  const revelationRef = useRef<HTMLDivElement>(null);
  const { name, description, themes } = data[0];

  const revealedTheme = tableRollNumber !== null
    ? themes[tableRollNumber - 1]
    : null;

  useEffect(() => {
    if (tableRollNumber !== null && revelationRef.current) {
      revelationRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [tableRollNumber]);

  return (
    <div className="pb-12">
      <SparkTableHeader themeName={name} themeDescription={description} />
      <SparkTableRoll onRoll={setTableRollNumber} />

      {revealedTheme && (
        <div ref={revelationRef} className="revelation-panel mx-4 mb-8 border border-forge-gold/40 bg-forge-surface p-6">
          <div className="flex items-baseline gap-3 mb-5 border-b border-forge-border pb-4">
            <span className="font-mono text-forge-muted text-xs">
              {String(tableRollNumber).padStart(2, '0')}
            </span>
            <h2 className="font-[family-name:var(--font-cinzel)] text-forge-gold text-xl uppercase tracking-widest">
              {revealedTheme.name}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {revealedTheme.subthemes.map((sub) => (
              <div key={sub.id}>
                <p className="font-[family-name:var(--font-electrolize)] text-xs text-forge-muted uppercase tracking-widest mb-3 border-b border-forge-border pb-1">
                  {sub.name}
                </p>
                <ul className="space-y-1.5">
                  {sub.descriptors.map((d) => (
                    <li key={d.id} className="font-mono text-sm text-forge-text">
                      {d.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-forge-border mx-4 border border-forge-border">
        {themes.map((theme, index) => {
          const isSelected = index + 1 === tableRollNumber;
          return (
            <div
              key={theme.id}
              className={`flex flex-col bg-forge-surface ${isSelected ? 'ring-1 ring-inset ring-forge-gold' : ''}`}>
              <div className={`p-3 border-b flex items-baseline gap-2 ${isSelected ? 'border-forge-gold/30' : 'border-forge-border'}`}>
                <span className="font-mono text-forge-muted text-xs">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className={`font-[family-name:var(--font-cinzel)] text-sm uppercase tracking-wide ${isSelected ? 'text-forge-gold' : 'text-forge-text'}`}>
                  {theme.name}
                </h3>
              </div>
              <div className="grid grid-cols-2 flex-1">
                {theme.subthemes.map((subtheme) => (
                  <SparkTableSubthemeHeader key={subtheme.id} subtheme={subtheme} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
