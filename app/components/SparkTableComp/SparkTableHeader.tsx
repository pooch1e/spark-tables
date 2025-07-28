'use client';
//title of theme
export default function SparkTableHeader({ themeName, themeDescription }) {
  // console.log(themeName);
  return (
    <div>
      <div className="mb-4 text-center text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        <h3>{themeName}</h3>
      </div>
      <div className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
        <h4>{themeDescription}</h4>
      </div>
    </div>
  );
}
