import SparkTableHeader from './SparkTableHeader';
import SparkTableSubthemeHeader from './SparkTableSubThemeHeader';

export default function SparkTable({ data }) {
  const tableData = data[0];
  const { name, description, themes } = tableData;
  // going to have to iterate over all of this...

  // console.log(themes);

  return (
    <>
      <SparkTableHeader themeName={name} themeDescription={description} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full p-2">
        {themes.map((theme) => {
          return (
            <div key={theme.id} className="flex flex-col">
              <h3 className="font-bold text-4xl mb-2 ml-1 text-center">
                ☾⋆⁺₊✧{theme.name}✩₊˚.⋆☾
              </h3>
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4 border-1 p-2">
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
            </div>
          );
        })}
      </div>
    </>
  );
}
