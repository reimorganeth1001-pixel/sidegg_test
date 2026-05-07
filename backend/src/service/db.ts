import { PrismaClient } from '@prisma/client';

/**
 * Shared Prisma client instance.
 *
 * This centralizes DB access so connection pooling and middleware are applied once.
 */
const prisma = new PrismaClient();

export default prisma;
