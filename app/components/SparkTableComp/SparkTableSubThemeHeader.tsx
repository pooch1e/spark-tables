import SparkTableCol from './SparkTableCol';

export default function SparkTableSubthemeHeader({ subtheme }) {
  // going to map over data and this will take one of each subtheme in order
  // console.log(subtheme);

  return (
    <>
      <div className="col">
        <p className="font-semibold">{subtheme.name}</p>
        <SparkTableCol descriptors={subtheme.descriptors} />
      </div>
    </>
  );
}
