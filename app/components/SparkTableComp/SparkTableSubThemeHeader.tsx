import SparkTableCol from './SparkTableCol';
import type { Subthemes } from '@/app/types';

export default function SparkTableSubthemeHeader({ subtheme }: Subthemes) {


  return (
    <>
      <div className="col">
        <p className="font-semibold bg-gray-600 text-white p-2 text-center">{subtheme.name}</p>
        <SparkTableCol descriptors={subtheme.descriptors} />
      </div>
    </>
  );
}
