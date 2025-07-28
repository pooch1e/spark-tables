export default function SparkTableSubthemeHeader({ subthemes }) {
  // going to map over data and this will take one of each subtheme in order
  console.log(subthemes);
  const subthemeOne = subthemes[0];
  const subthemeTwo = subthemes[1];
  return (
    <div>
      <div className="col">
        <p>{subthemeOne.name}</p>
      </div>
      <div className="col">
        <p>{subthemeTwo.name}</p>
      </div>
    </div>
  );
}
