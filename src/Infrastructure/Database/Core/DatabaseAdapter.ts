import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export class DatabaseAdapter
{
    static CreateAdapter(connectionString: string): PrismaPg
    {
        const pool = new Pool({
            connectionString,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        return new PrismaPg(pool);
    }
}
