import { seed } from './seed.ts';
import { closeConnection } from '../connections.ts';
import {
  topics,
  themes,
  subthemes,
  descriptors,
} from '../../data/development-data/index.ts';

const runSeed = async () => {
  try {
    await seed({
      topicsTestData: topics,
      themeTestData: themes,
      subthemeData: subthemes,
      descriptorData: descriptors,
    });
    console.log('seeded DB!');
  } catch (err) {
    console.log(err, 'err in seeding db');
  } finally {
    await closeConnection();
  }
};

runSeed();
