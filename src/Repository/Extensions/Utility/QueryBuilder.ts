import { Search } from "../../../Entities/RequestFeatures/Core/Search";
import { SearchTerm } from "../../../Entities/RequestFeatures/Core/SearchTerm";
import { QueryBuilderBadRequestException } from "../../../Entities/Exceptions/QueryBuilderBadRequestExeption";

type WhereCondition = Record<string, unknown>;
type OrderByCondition = Record<string, unknown>;

export class QueryBuilder {
    /**
     * Builds a Prisma where condition from search filters
     * Supports: CONTAINS, STARTWITH, ENDWITH, GREATER, LESSER, GREATEROREQUAL, LESSEROREQUAL, EQUAL, NOTEQUAL, ISNULL, ISNOTNULL
     */
    static BuildFilterExpression(searches: Search[]): WhereCondition
    {
        const whereConditions: WhereCondition[] = [];

        if (!searches || searches.length === 0)
        {
            return {};
        }

        const specialConditions = ["ISNULL", "ISNOTNULL"];

        for (const search of searches)
            {
            if (!search.Name || !search.Condition)
                {
                continue;
            }

            // Handle special conditions or empty values
            if (specialConditions.includes(search.Condition) || (!specialConditions.includes(search.Condition) && !search.Value))
            {
                search.Value = search.Value ?? "";
            }

            try
            {
                const fieldName = search.Name.toLowerCase();
                const condition = this.buildSingleCondition(search, fieldName);

                if (condition)
                {
                    whereConditions.push(condition);
                }
            }
            catch (error)
            {
                throw new QueryBuilderBadRequestException( `Invalid filter on field: ${search.Name}`);
            }
        }

        // Combine all conditions with AND logic
        if (whereConditions.length === 0)
        {
            return {};
        }

        return { AND: whereConditions };
    }

    private static buildSingleCondition(search: Search, fieldName: string): WhereCondition | null
    {
        const condition = search.Condition?.toUpperCase();
        const value = search.Value;

        switch (condition)
        {
            case "CONTAINS":
                return {
                    [fieldName]:
                        {
                            contains: value,
                            mode: 'insensitive'
                        }
                };

            case "STARTWITH":
                return {
                    [fieldName]:
                        {
                            startsWith: value,
                            mode: 'insensitive'
                        }
                };

            case "ENDWITH":
                return {
                    [fieldName]:
                        {
                            endsWith: value,
                            mode: 'insensitive'
                        }
                };

            case "GREATER":
                return {
                    [fieldName]:
                        {
                            gt: this.parseValue(value!)
                        }
                };

            case "LESSER":
                return {
                    [fieldName]:
                        {
                            lt: this.parseValue(value!)
                        }
                };

            case "GREATEROREQUAL":
                return {
                    [fieldName]:
                        {
                            gte: this.parseValue(value!)
                        }
                };

            case "LESSEROREQUAL":
                return {
                    [fieldName]:
                        {
                            lte: this.parseValue(value!)
                        }
                };

            case "EQUAL":
                return {
                    [fieldName]: value
                };

            case "NOTEQUAL":
                return {
                    [fieldName]:
                        {
                            not: value
                        }
                };

            case "ISNULL":
                return {
                    [fieldName]: null
                };

            case "ISNOTNULL":
                return {
                    [fieldName]: {
                        not: null
                    }
                };

            default:
                return null;
        }
    }

    private static parseValue(value: string): string | number | boolean | Date {
        // Try to parse as number
        if (!isNaN(Number(value)) && value.trim() !== '')
        {
            return Number(value);
        }

        // Try to parse as date
        const dateValue = new Date(value);
        if (!isNaN(dateValue.getTime()))
        {
            return dateValue;
        }

        // Try to parse as boolean
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;

        // Return as string
        return value;
    }

    /**
     * Builds a Prisma where condition for searching across multiple fields
     * Uses OR logic to search across all specified fields
     */
    static BuildSearchExpression(searchTerm: SearchTerm): WhereCondition
    {
        // Return empty if Name or Value is missing
        if (!searchTerm.Name || !searchTerm.Value)
        {
            return {};
        }

        // Split property names by comma and trim
        const propertyNames = searchTerm.Name.split(',').map(name => name.trim());
        const searchValue = searchTerm.Value.toLowerCase();

        const orConditions: WhereCondition[] = [];

        for (const propertyName of propertyNames)
        {
            if (!propertyName) continue;

            // Handle nested properties (e.g., "user.name" becomes { user: { name: { contains: ... } } })
            const nestedCondition = this.buildNestedSearchCondition(
                propertyName.toLowerCase(),
                searchValue
            );

            if (nestedCondition)
            {
                orConditions.push(nestedCondition);
            }
        }

        if (orConditions.length === 0)
        {
            return {};
        }

        return { OR: orConditions };
    }

    private static buildNestedSearchCondition(propertyPath: string, searchValue: string): WhereCondition | null
    {
        const parts = propertyPath.split('.');

        if (parts.length === 1)
        {
            // Simple property
            return {
                [parts[0]]: {
                    contains: searchValue,
                    mode: 'insensitive'
                }
            };
        }

        // Nested property (e.g., "user.name")
        let condition: any = {
            contains: searchValue,
            mode: 'insensitive'
        };

        // Build nested structure from right to left
        for (let i = parts.length - 1; i >= 0; i--)
        {
            condition = {
                [parts[i]]: condition
            };
        }

        return condition;
    }

    /**
     * Builds Prisma orderBy from order query string
     * Format: "field1 asc, field2 desc" or "field1 ascending, field2 descending"
     */
    static BuildOrderQuery(orderByQueryString?: string): OrderByCondition[]
    {
        if (!orderByQueryString || orderByQueryString.trim() === '')
        {
            return [{ id: 'asc' }];
        }

        const orderParams = orderByQueryString.trim().split(',');
        const orderBy: OrderByCondition[] = [];

        for (const orderParam of orderParams) {
            if (!orderParam || orderParam.trim() === '')
            {
                continue;
            }

            const trimmed = orderParam.trim();
            const parts = trimmed.split(' ');

            if (parts.length === 0) continue;

            const fieldPath = parts[0];
            const direction = parts.length > 1 &&
                             (parts[1].toLowerCase() === 'desc' || parts[1].toLowerCase() === 'descending')
                ? 'desc'
                : 'asc';

            // Handle nested properties for ordering (e.g., "user.name")
            const orderCondition = this.buildNestedOrderBy(fieldPath.toLowerCase(), direction);
            orderBy.push(orderCondition);
        }

        return orderBy.length > 0 ? orderBy : [{ id: 'asc' }];
    }

    private static buildNestedOrderBy(propertyPath: string, direction: 'asc' | 'desc'): OrderByCondition
    {
        const parts = propertyPath.split('.');

        if (parts.length === 1)
        {
            return { [parts[0]]: direction };
        }

        let orderCondition: any = direction;

        for (let i = parts.length - 1; i >= 0; i--) {
            orderCondition = {
                [parts[i]]: orderCondition
            };
        }

        return orderCondition;
    }
}
