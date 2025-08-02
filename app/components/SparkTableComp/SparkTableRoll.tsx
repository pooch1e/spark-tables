import { randomNumGenerator } from '@/app/lib/utils/randomNumGenerator';
export default function SparkTableRoll() {
  const handleButtonClick = () => {
    const firstDiceRoll: number = randomNumGenerator(9);
    const secondDiceRoll: number = randomNumGenerator(9);
    console.log(firstDiceRoll, secondDiceRoll);
  };
  return (
    <div className="p-2 justify-center">
      <button
        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        onClick={handleButtonClick}>
        Roll On Table
      </button>
    </div>
  );
}
