type Descriptor = {
  id: number;
  text: string;
};

type Subtheme = {
  id: number;
  name: string;
  order: number;
  descriptors: Descriptor[];
};

type Theme = {
  id: number;
  name: string;
  order: number;
  subthemes: Subtheme[];
};

type Topic = {
  id: number;
  name: string;
  description: string | null;
  themes: Theme[];
};

export function nestTopicData(rows: any[]): Topic[] {
  const topicsMap = new Map<number, Topic>();

  for (const row of rows) {
    const topicRaw = row.topics;
    const themeRaw = row.themes;
    const subthemeRaw = row.subthemes;
    const descriptorRaw = row.descriptors;

    // Get or create topic (without mutation)
    if (!topicsMap.has(topicRaw.id)) {
      topicsMap.set(topicRaw.id, {
        id: topicRaw.id,
        name: topicRaw.name,
        description: topicRaw.description,
        themes: [],
      });
    }

    const currentTopic = topicsMap.get(topicRaw.id)!;

    // Handle theme (create new themes array if adding)
    if (themeRaw) {
      const existingTheme = currentTopic.themes.find(
        (t) => t.id === themeRaw.id
      );

      if (!existingTheme) {
        const newTheme: Theme = {
          id: themeRaw.id,
          name: themeRaw.name,
          order: themeRaw.order,
          subthemes: [],
        };

        // Create new topic with updated themes array
        topicsMap.set(topicRaw.id, {
          ...currentTopic,
          themes: [...currentTopic.themes, newTheme],
        });
      }
    }

    // Handle subtheme
    if (subthemeRaw) {
      const updatedTopic = topicsMap.get(topicRaw.id)!;
      const theme = updatedTopic.themes.find((t) => t.id === themeRaw?.id);

      if (theme) {
        const existingSubtheme = theme.subthemes.find(
          (s) => s.id === subthemeRaw.id
        );

        if (!existingSubtheme) {
          const newSubtheme: Subtheme = {
            id: subthemeRaw.id,
            name: subthemeRaw.name,
            order: subthemeRaw.order,
            descriptors: [],
          };

          // Create new theme with updated subthemes
          const updatedTheme = {
            ...theme,
            subthemes: [...theme.subthemes, newSubtheme],
          };

          // Create new topic with updated themes
          const updatedThemes = updatedTopic.themes.map((t) =>
            t.id === theme.id ? updatedTheme : t
          );

          topicsMap.set(topicRaw.id, {
            ...updatedTopic,
            themes: updatedThemes,
          });
        }
      }
    }

    // Handle descriptor
    if (descriptorRaw?.id) {
      const updatedTopic = topicsMap.get(topicRaw.id)!;
      const theme = updatedTopic.themes.find((t) => t.id === themeRaw?.id);
      const subtheme = theme?.subthemes.find((s) => s.id === subthemeRaw?.id);

      if (subtheme) {
        const exists = subtheme.descriptors.some(
          (d) => d.id === descriptorRaw.id
        );

        if (!exists) {
          const newDescriptor: Descriptor = {
            id: descriptorRaw.id,
            text: descriptorRaw.text,
          };

          // Create new subtheme with updated descriptors
          const updatedSubtheme = {
            ...subtheme,
            descriptors: [...subtheme.descriptors, newDescriptor],
          };

          // Create new theme with updated subthemes
          const updatedTheme = {
            ...theme!,
            subthemes: theme!.subthemes.map((s) =>
              s.id === subtheme.id ? updatedSubtheme : s
            ),
          };

          // Create new topic with updated themes
          const updatedThemes = updatedTopic.themes.map((t) =>
            t.id === theme!.id ? updatedTheme : t
          );

          topicsMap.set(topicRaw.id, {
            ...updatedTopic,
            themes: updatedThemes,
          });
        }
      }
    }
  }

  return Array.from(topicsMap.values());
}
