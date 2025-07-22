type Descriptor = { id: number; text: string };
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

    if (!topicsMap.has(topicRaw.id)) {
      topicsMap.set(topicRaw.id, {
        id: topicRaw.id,
        name: topicRaw.name,
        description: topicRaw.description,
        themes: [],
      });
    }

    const topic = topicsMap.get(topicRaw.id)!;

    let theme = topic.themes.find((t) => t.id === themeRaw?.id);
    if (!theme && themeRaw) {
      theme = {
        id: themeRaw.id,
        name: themeRaw.name,
        order: themeRaw.order,
        subthemes: [],
      };
      topic.themes.push(theme);
    }

    let subtheme = theme?.subthemes.find((s) => s.id === subthemeRaw?.id);
    if (!subtheme && subthemeRaw) {
      subtheme = {
        id: subthemeRaw.id,
        name: subthemeRaw.name,
        order: subthemeRaw.order,
        descriptors: [],
      };
      theme?.subthemes.push(subtheme);
    }

    if (descriptorRaw?.id) {
      const exists = subtheme?.descriptors.some(
        (d) => d.id === descriptorRaw.id
      );
      if (!exists) {
        subtheme?.descriptors.push({
          id: descriptorRaw.id,
          text: descriptorRaw.text,
        });
      }
    }
  }

  return Array.from(topicsMap.values());
}
