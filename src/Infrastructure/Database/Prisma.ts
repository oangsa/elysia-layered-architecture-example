import { PrismaClient } from '../../../generated/prisma/client';
import type { PrismaPg } from "@prisma/adapter-pg";

export class PrismaDB extends PrismaClient
{
    constructor(adapter: PrismaPg)
    {
        super({
            adapter,
            log: process.env.NODE_ENV === 'development'
                ? ['query', 'info', 'warn', 'error']
                : ['error'],
        });
    }
}
