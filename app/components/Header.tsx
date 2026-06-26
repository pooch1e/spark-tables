'use client';
import Link from 'next/link';
export default function Header() {
  return (
    <header className="border-b border-forge-border py-5 px-4">
      <h1 className="font-[family-name:var(--font-cinzel)] text-2xl text-center uppercase tracking-[0.35em] text-forge-text">
        <Link href="/" className="hover:text-forge-gold transition-colors duration-150">
          Spark Forge
        </Link>
      </h1>
    </header>
  );
}
