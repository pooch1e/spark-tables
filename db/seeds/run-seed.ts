import { seed } from './seed';
import {
  topics,
  themes,
  subthemes,
  descriptors,
} from '../../data/development-data/index.ts';

const runSeed = async () => {
  await seed({ topics, themes, subthemes, descriptors });
  console.log('seeded DB!');
};

runSeed();
