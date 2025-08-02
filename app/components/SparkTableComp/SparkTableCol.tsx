export default function SparkTableCol({ descriptors }) {
  return (
    <div className="col border-2 p-2">
      <ol className="space-y-0">
        {descriptors.map((descriptor, index) => (
          <li
            key={descriptor.id}
            // alternate row bg colour
            className={`px-3 py-2 text-center ${
              index % 2 === 0 ? 'bg-gray-100/70' : 'bg-white/80'
            }`}>
            {descriptor.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
