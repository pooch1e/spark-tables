'use client';
import { useRouter } from 'next/router';
import { randomNumGenerator } from '../lib/utils/randomNumGenerator';

export default function RandomNumberButton() {
  const tableRoutes: Record<number, string> = {
    1: '/wilderness',
    2: '/civilisation',
    3: '/dungeons',
    4: 'maritime',
  };
  const router = useRouter();
  const handleButtonClick = () => {
    const randomNumber: number = randomNumGenerator();
    const route = tableRoutes[randomNumber];

    if (route) {
      router.push(route);
    } else {
      console.log('error in finding route for random roll');
    }
  };
  return (
    <div className="p-2 justify-center">
      <button
        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        onClick={handleButtonClick}>
        Roll Table
      </button>
    </div>
  );
}
