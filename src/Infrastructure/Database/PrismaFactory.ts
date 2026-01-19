import { PrismaDB } from './Prisma';
import { DatabaseAdapter } from './Core/DatabaseAdapter';
import { DatabaseConfig } from './Core/DatabaseConfig';

let prismaInstance: PrismaDB | null = null;

export class PrismaFactory {
    static initialize(connectionString?: string): PrismaDB
    {
        if (!prismaInstance)
        {
            const connString = connectionString || DatabaseConfig.getConnectionString();
            const adapter = DatabaseAdapter.CreateAdapter(connString);
            prismaInstance = new PrismaDB(adapter);
        }

        return prismaInstance;
    }

    static getInstance(): PrismaDB
    {
        if (!prismaInstance)
        {
            throw new Error('Prisma not initialized. Call PrismaFactory.initialize() first.');
        }

        return prismaInstance;
    }

    static async disconnect(): Promise<void>
    {
        if (prismaInstance)
        {
            await prismaInstance.$disconnect();
            prismaInstance = null;
        }
    }
}
