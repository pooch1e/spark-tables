'use client';
import Link from 'next/link';
export default function Header() {
  return (
    <>
      {' '}
      <h1 className="p-2.5 font-[family-name:var(--font-electrolize)] text-4xl text-center">
        <Link href={`/`}>Spark Forge</Link>
      </h1>
      {/* <h2>Inspiration Tables</h2> */}
    </>
  );
}
