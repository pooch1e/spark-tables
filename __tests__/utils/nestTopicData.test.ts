import { nestTopicData } from '@/app/lib/utils/nestTopicData.ts';

describe('nestTopicData', () => {
  // 1. BASIC FUNCTIONALITY TESTS
  test('handles empty array input', () => {
    const result = nestTopicData([]);
    expect(result).toEqual([]);
  });

  test('creates single topic with no nested data', () => {
    const mockRows = [
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: null,
        subthemes: null,
        descriptors: null,
      },
    ];

    const result = nestTopicData(mockRows);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 1,
      name: 'Wilderness',
      description: 'Wild areas',
      themes: [],
    });
  });

  test('creates topic with themes but no subthemes', () => {
    const mockRows = [
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: null,
        descriptors: null,
      },
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 2, name: 'Mountain', order: 2 },
        subthemes: null,
        descriptors: null,
      },
    ];

    const result = nestTopicData(mockRows);

    expect(result).toHaveLength(1);
    expect(result[0].themes).toHaveLength(2);
    expect(result[0].themes[0]).toEqual({
      id: 1,
      name: 'Forest',
      order: 1,
      subthemes: [],
    });
    expect(result[0].themes[1]).toEqual({
      id: 2,
      name: 'Mountain',
      order: 2,
      subthemes: [],
    });
  });

  test('creates fully nested structure', () => {
    const mockRows = [
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: { id: 1, name: 'Dense Forest', order: 1 },
        descriptors: { id: 1, text: 'Thick canopy' },
      },
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: { id: 1, name: 'Dense Forest', order: 1 },
        descriptors: { id: 2, text: 'Limited visibility' },
      },
    ];

    const result = nestTopicData(mockRows);

    expect(result).toHaveLength(1);
    expect(result[0].themes).toHaveLength(1);
    expect(result[0].themes[0].subthemes).toHaveLength(1);
    expect(result[0].themes[0].subthemes[0].descriptors).toHaveLength(2);

    expect(result[0].themes[0].subthemes[0].descriptors).toEqual([
      { id: 1, text: 'Thick canopy' },
      { id: 2, text: 'Limited visibility' },
    ]);
  });

  test('prevents duplicate topics', () => {
    const mockRows = [
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: null,
        subthemes: null,
        descriptors: null,
      },
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: null,
        descriptors: null,
      },
    ];

    const result = nestTopicData(mockRows);

    expect(result).toHaveLength(1);
    expect(result[0].themes).toHaveLength(1);
  });

  test('prevents duplicate themes', () => {
    const mockRows = [
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: { id: 1, name: 'Dense Forest', order: 1 },
        descriptors: null,
      },
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: { id: 2, name: 'Light Forest', order: 2 },
        descriptors: null,
      },
    ];

    const result = nestTopicData(mockRows);

    expect(result[0].themes).toHaveLength(1);
    expect(result[0].themes[0].subthemes).toHaveLength(2);
  });

  test('prevents duplicate subthemes', () => {
    const mockRows = [
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: { id: 1, name: 'Dense Forest', order: 1 },
        descriptors: { id: 1, text: 'Thick canopy' },
      },
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: { id: 1, name: 'Dense Forest', order: 1 },
        descriptors: { id: 2, text: 'Limited visibility' },
      },
    ];

    const result = nestTopicData(mockRows);

    expect(result[0].themes[0].subthemes).toHaveLength(1);
    expect(result[0].themes[0].subthemes[0].descriptors).toHaveLength(2);
  });

  test('prevents duplicate descriptors', () => {
    const mockRows = [
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: { id: 1, name: 'Dense Forest', order: 1 },
        descriptors: { id: 1, text: 'Thick canopy' },
      },
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: { id: 1, name: 'Dense Forest', order: 1 },
        descriptors: { id: 1, text: 'Thick canopy' }, // duplicate
      },
    ];

    const result = nestTopicData(mockRows);

    expect(result[0].themes[0].subthemes[0].descriptors).toHaveLength(1);
  });

  test('handles multiple topics', () => {
    const mockRows = [
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: null,
        descriptors: null,
      },
      {
        topics: { id: 2, name: 'Urban', description: 'City areas' },
        themes: { id: 2, name: 'Streets', order: 1 },
        subthemes: null,
        descriptors: null,
      },
    ];

    const result = nestTopicData(mockRows);

    expect(result).toHaveLength(2);
    expect(result.find((t) => t.id === 1)?.name).toBe('Wilderness');
    expect(result.find((t) => t.id === 2)?.name).toBe('Urban');
  });

  test('handles null description', () => {
    const mockRows = [
      {
        topics: { id: 1, name: 'Wilderness', description: null },
        themes: null,
        subthemes: null,
        descriptors: null,
      },
    ];

    const result = nestTopicData(mockRows);

    expect(result[0].description).toBeNull();
  });

  test('skips null themes', () => {
    const mockRows = [
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: null,
        subthemes: { id: 1, name: 'Orphaned', order: 1 },
        descriptors: null,
      },
    ];

    const result = nestTopicData(mockRows);

    expect(result[0].themes).toHaveLength(0);
  });

  test('skips null subthemes', () => {
    const mockRows = [
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: null,
        descriptors: { id: 1, text: 'Orphaned descriptor' },
      },
    ];

    const result = nestTopicData(mockRows);

    expect(result[0].themes[0].subthemes).toHaveLength(0);
  });

  test('skips descriptors without id', () => {
    const mockRows = [
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: { id: 1, name: 'Dense Forest', order: 1 },
        descriptors: { id: null, text: 'Should be skipped' },
      },
    ];

    const result = nestTopicData(mockRows);

    expect(result[0].themes[0].subthemes[0].descriptors).toHaveLength(0);
  });

  test('handles complex nested structure with multiple branches', () => {
    const mockRows = [
      // Topic 1, Theme 1, Subtheme 1, Descriptor 1
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: { id: 1, name: 'Dense Forest', order: 1 },
        descriptors: { id: 1, text: 'Thick canopy' },
      },
      // Topic 1, Theme 1, Subtheme 1, Descriptor 2
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: { id: 1, name: 'Dense Forest', order: 1 },
        descriptors: { id: 2, text: 'Limited visibility' },
      },
      // Topic 1, Theme 1, Subtheme 2, Descriptor 3
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: { id: 2, name: 'Light Forest', order: 2 },
        descriptors: { id: 3, text: 'Sparse trees' },
      },
      // Topic 1, Theme 2, Subtheme 3, Descriptor 4
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 2, name: 'Mountain', order: 2 },
        subthemes: { id: 3, name: 'Rocky Peak', order: 1 },
        descriptors: { id: 4, text: 'Steep terrain' },
      },
    ];

    const result = nestTopicData(mockRows);

    expect(result).toHaveLength(1);
    expect(result[0].themes).toHaveLength(2);
    expect(result[0].themes[0].subthemes).toHaveLength(2);
    expect(result[0].themes[1].subthemes).toHaveLength(1);
    expect(result[0].themes[0].subthemes[0].descriptors).toHaveLength(2);
    expect(result[0].themes[0].subthemes[1].descriptors).toHaveLength(1);
    expect(result[0].themes[1].subthemes[0].descriptors).toHaveLength(1);
  });

  test('preserves order values', () => {
    const mockRows = [
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 5 },
        subthemes: { id: 1, name: 'Dense Forest', order: 10 },
        descriptors: null,
      },
    ];

    const result = nestTopicData(mockRows);

    expect(result[0].themes[0].order).toBe(5);
    expect(result[0].themes[0].subthemes[0].order).toBe(10);
  });

  test('maintains correct TypeScript types', () => {
    const mockRows = [
      {
        topics: { id: 1, name: 'Wilderness', description: 'Wild areas' },
        themes: { id: 1, name: 'Forest', order: 1 },
        subthemes: { id: 1, name: 'Dense Forest', order: 1 },
        descriptors: { id: 1, text: 'Thick canopy' },
      },
    ];

    const result = nestTopicData(mockRows);

    const topic = result[0];
    expect(typeof topic.id).toBe('number');
    expect(typeof topic.name).toBe('string');
    expect(
      topic.description === null || typeof topic.description === 'string'
    ).toBe(true);
    expect(Array.isArray(topic.themes)).toBe(true);

    if (topic.themes.length > 0) {
      const theme = topic.themes[0];
      expect(typeof theme.id).toBe('number');
      expect(typeof theme.name).toBe('string');
      expect(typeof theme.order).toBe('number');
      expect(Array.isArray(theme.subthemes)).toBe(true);
    }
  });
});
