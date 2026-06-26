type Descriptor = { id: number; text: string };

export default function SparkTableCol({ descriptors }: { descriptors: Descriptor[] }) {
  return (
    <ul>
      {descriptors.map((descriptor, index) => (
        <li
          key={descriptor.id}
          className={`px-3 py-1.5 font-mono text-xs text-forge-text text-center ${
            index % 2 === 0 ? 'bg-forge-surface' : 'bg-forge-elevated'
          }`}>
          {descriptor.text}
        </li>
      ))}
    </ul>
  );
}
