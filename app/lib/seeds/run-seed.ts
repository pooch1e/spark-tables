import { prisma } from '../seeds/prisma';
import { seed } from './seed';

const runSeed = () => {
  return seed(devData).then(() => prisma.$disconnect());
};

runSeed();
