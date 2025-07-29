import SparkTableCol from './SparkTableCol';
import { Subthemes } from '@/app/types';

export default function SparkTableSubthemeHeader({ subtheme }) {
  // going to map over data and this will take one of each subtheme in order
  // console.log(subtheme);

  return (
    <>
      <div className="col">
        <p className="font-semibold bg-gray-600 text-white">{subtheme.name}</p>
        <SparkTableCol descriptors={subtheme.descriptors} />
      </div>
    </>
  );
}
