import SparkTableCol from './SparkTableCol';
import SparkTableHeader from './SparkTableHeader';
import SparkTableSubthemeHeader from './SparkTableSubThemeHeader';
import SparkTableThemeHeader from './SparkTableThemeHeader';

export default function SparkTable({ data }) {
  const wildernessTableData = data[0];
  const { name, description, themes } = wildernessTableData;
  // going to have to iterate over all of this...

  // console.log(themes);

  return (
    <>
      <SparkTableHeader themeName={name} themeDescription={description} />
      <div className="space-y-6">
        {themes.map((theme) => {
          return (
            <div key={theme.id}>
              <h3 className="text-lg font-bold mb-2">{theme.name}</h3>
              <div className="grid grid-cols-2 gap-4">
                {theme.subthemes.map((subtheme) => {
                  return (
                    <SparkTableSubthemeHeader
                      key={subtheme.id}
                      subtheme={subtheme}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
