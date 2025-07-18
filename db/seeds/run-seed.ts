import { seed } from './seed';
import { closeConnection, db } from '../connections';

const runSeed = () => {
  return seed(devData).then(() => closeConnection());
};

runSeed();
