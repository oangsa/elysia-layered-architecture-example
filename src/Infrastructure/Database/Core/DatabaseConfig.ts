import { DatabaseConnectionException } from "../../../Entities/Exceptions/Database/DatabaseCustomException";

export class DatabaseConfig
{
    static getConnectionString(): string
    {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString)
        {
            throw new DatabaseConnectionException(process.env.NODE_ENV === 'production' ?
                "Database connection string is not defined." :
                "DATABASE_URL environment variable is not set.");
        }

        return connectionString;
    }
}
