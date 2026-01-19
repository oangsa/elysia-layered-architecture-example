import { PrismaClient } from "../../../generated/prisma/client";
import { IUserRepository } from "../../Contracts/Repository/IUserRepository";
import { User } from "../../Entities/Models";
import { PagedList, UserParameter} from "../../Entities/RequestFeatures";
import { QueryBuilder } from "./Extensions/Utility/QueryBuilder";

export class UserRepository implements IUserRepository
{
    private readonly _prisma: PrismaClient;

    constructor(prisma: PrismaClient)
    {
        this._prisma = prisma;
    }

    async GetUserByEmail(email: string): Promise<User | null>
    {
        const user = await this._prisma.user.findUnique({
            where: { email }
        });

        if (!user) return null;

        return new User(
            user.id,
            user.createdBy ?? '',
            user.name ?? '',
            user.email,
            ''
        );
    }

    async GetUserById(id: number): Promise<User | null>
    {
        const user = await this._prisma.user.findUnique({
            where: { id }
        });

        if (!user) return null;

        return new User(
            user.id,
            user.createdBy ?? '',
            user.name ?? '',
            user.email,
            ''
        );
    }

    async GetListUser(userParameter: UserParameter): Promise<PagedList<User>>
    {
        const skip = (userParameter.PageNumber - 1) * userParameter.PageSize;

        // Build where conditions from search filters
        let whereCondition: any = {};

        if (userParameter.Search && userParameter.Search.length > 0)
        {
            whereCondition = QueryBuilder.BuildFilterExpression(userParameter.Search);
        }

        // Build search expression from search term
        if (userParameter.SearchTerm)
        {
            const searchExpression = QueryBuilder.BuildSearchExpression(userParameter.SearchTerm);
            whereCondition = { ...whereCondition, ...searchExpression };
        }

        // Build order by
        const orderBy = QueryBuilder.BuildOrderQuery(userParameter.OrderBy);

        const [users, totalCount] = await Promise.all([
            this._prisma.user.findMany({
                where: whereCondition,
                skip,
                take: userParameter.PageSize,
                orderBy: orderBy
            }),
            this._prisma.user.count({
                where: whereCondition
            })
        ]);

        const userEntities = users.map(user => new User(
            user.id,
            user.createdBy ?? '',
            user.name ?? '',
            user.email,
            ''
        ));

        return new PagedList(userEntities, totalCount, userParameter.PageNumber, userParameter.PageSize);
    }

    async CreateUser(user: User): Promise<User>
    {
        const createdUser = await this._prisma.user.create({
            data: {
                id: user.Id,
                name: user.Name,
                email: user.Email,
                password: user.Password,
                createdAt: user.CreatedAt,
                updatedAt: user.UpdatedAt,
                createdBy: user.CreatedBy,
                updatedBy: user.UpdatedBy
            }
        });

        return new User(
            createdUser.id,
            createdUser.createdBy ?? '',
            createdUser.name ?? '',
            createdUser.email,
            ''
        );
    }

    async UpdateUser(user: User): Promise<User>
    {
        const updatedUser = await this._prisma.user.update({
            where: { id: user.Id },
            data: {
                name: user.Name,
                email: user.Email,
                password: user.Password,
                updatedAt: user.UpdatedAt,
                updatedBy: user.UpdatedBy
            }
        });

        return new User(
            updatedUser.id,
            updatedUser.createdBy ?? '',
            updatedUser.name ?? '',
            updatedUser.email,
            ''
        );
    }

    async DeleteUser(id: number): Promise<void>
    {
        await this._prisma.user.delete({
            where: { id }
        });
    }
}
