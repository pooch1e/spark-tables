export default function SparkTableHeader({ themeName, themeDescription }: { themeName: string; themeDescription: string | null }) {
  return (
    <div className="py-10 px-4 text-center border-b border-forge-border">
      <h1 className="font-[family-name:var(--font-cinzel)] text-4xl md:text-6xl uppercase tracking-widest text-forge-text mb-3">
        {themeName}
      </h1>
      {themeDescription && (
        <p className="font-mono text-forge-muted text-sm max-w-xl mx-auto leading-relaxed">
          {themeDescription}
        </p>
      )}
    </div>
  );
}
