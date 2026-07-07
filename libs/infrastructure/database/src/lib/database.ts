import { PrismaClient } from '../generated/prisma/index.js';

export const prisma = new PrismaClient({
  log: process.env['NODE_ENV'] === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export * from '../generated/prisma/index.js';
export * from './repositories/index.js';
