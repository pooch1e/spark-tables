'use client';
import SparkTableHeader from './SparkTableHeader';
import SparkTableRoll from './SparkTableRoll';
import SparkTableSubthemeHeader from './SparkTableSubThemeHeader';
import { Themes, Subthemes } from '@/app/types';
import { useState, useRef, useEffect } from 'react';

export default function SparkTable({ data }) {
  const [tableRollNumber, setTableRollNumber] = useState<number | null>(null);
  const selectedThemeRef = useRef<HTMLDivElement>(null);
  const tableData = data[0];
  const { name, description, themes } = tableData;

  const handleRoll = (rollResult: number) => {
    setTableRollNumber(rollResult);
  };

  useEffect(() => {
    if (tableRollNumber !== null && selectedThemeRef.current) {
      selectedThemeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center', //can edit this?
        inline: 'nearest',
      });
    }
  }, [tableRollNumber]);

  return (
    <>
      <SparkTableHeader themeName={name} themeDescription={description} />
      <SparkTableRoll onRoll={handleRoll} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full p-2">
        {themes.map((theme: Themes, index: number) => {
          const isSelected = index + 1 === tableRollNumber;

          return (
            <div
              key={theme.id}
              className="flex flex-col"
              ref={isSelected ? selectedThemeRef : null}>
              <h3
                className={`font-bold text-4xl mb-2 ml-1 text-center ${
                  isSelected ? 'highlight' : ''
                }`}>
                ☾⋆⁺₊✧{theme.name}✩₊˚.⋆☾
              </h3>
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4 border-1 p-2">
                  {theme.subthemes.map((subtheme: Subthemes) => {
                    return (
                      <SparkTableSubthemeHeader
                        key={subtheme.id}
                        subtheme={subtheme}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
