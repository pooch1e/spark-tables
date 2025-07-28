export default function SparkTableCol({ descriptors }) {
  return (
    <div className="col">
      <ol>
        {descriptors.map((descriptor) => (
          <li key={descriptor.id}>{descriptor.text}</li>
        ))}
      </ol>
    </div>
  );
}
