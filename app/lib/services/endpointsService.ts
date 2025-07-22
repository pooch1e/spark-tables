import { promises as fs } from 'fs';
import path from 'path';

export class Endpoints {
  static async getAllEndpoints() {
    try {
      const filePath = path.join(process.cwd(), '/endpoints.json');
      const jsonData = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(jsonData);
    } catch (err) {
      console.log(err);
      throw new Error('Failed to fetch endpoints');
    }
  }
}
