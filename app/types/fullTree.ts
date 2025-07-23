export interface FullTree {
  id: number;
  name: string;
  description: string | null;
  themes: {
    id: number;
    name: string;
    order: number;
    subthemes: {
      id: number;
      name: string;
      order: number;
      descriptors: {
        id: number;
        text: string;
      }[];
    }[];
  }[];
}
