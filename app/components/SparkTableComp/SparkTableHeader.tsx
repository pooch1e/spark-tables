'use client';
//title of theme
export default function SparkTableHeader({ themeName, themeDescription }) {
  console.log(themeName);
  return (
    <div>
      <div className="row">
        <h3>{themeName}</h3>
        <h4>{themeDescription}</h4>
      </div>
    </div>
  );
}
