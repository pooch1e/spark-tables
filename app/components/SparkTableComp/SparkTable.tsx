import SparkTableCol from './SparkTableCol';
import SparkTableHeader from './SparkTableHeader';
import SparkTableSubthemeHeader from './SparkTableSubThemeHeader';
import SparkTableThemeHeader from './SparkTableThemeHeader';

export default function SparkTable({ data }) {
  const wildernessTableData = data[0];
  const { name, description, themes } = wildernessTableData;
  // going to have to iterate over all of this...

  return (
    <>
      <SparkTableHeader themeName={name} themeDescription={description} />
      {themes?.map((theme, themeIndex) => {
        return (
          <div key={themeIndex}>
            <SparkTableThemeHeader theme={theme.name} />

            {theme?.subthemes.map((subtheme, subthemeIndex) => {
              return (
                <div key={subthemeIndex}>
                  <SparkTableSubthemeHeader subthemes={subtheme} />
                </div>
              );
            })}
          </div>
        );
      })}

      <SparkTableCol></SparkTableCol>
      <SparkTableCol></SparkTableCol>
    </>
  );
}
