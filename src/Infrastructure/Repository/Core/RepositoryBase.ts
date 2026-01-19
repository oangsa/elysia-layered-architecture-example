import { PrismaClient } from "../../../../generated/prisma/client";
import { IRepositoryBase } from "../../../Contracts/Repository/Core/IRepositoryBase";

export abstract class RepositoryBase<T> implements IRepositoryBase<T>
{
    protected prisma: PrismaClient;
    protected abstract get modelName(): string;

    constructor(prisma: PrismaClient)
    {
        this.prisma = prisma;
    }

    protected get model(): any
    {
        return (this.prisma as any)[this.modelName.toLowerCase()];
    }

    async GetById(id: number): Promise<T | null>
    {
        return await this.model.findUnique({
            where: { id }
        });
    }

    async GetAll(): Promise<T[]>
    {
        return await this.model.findMany();
    }

    async FindByCondition(condition: Partial<T>, includes?: string[]): Promise<T[]>
    {
        const query: any = {
            where: condition
        };

        if (includes && includes.length > 0) {
            query.include = includes.reduce((acc: any, include: string) => {
                acc[include] = true;
                return acc;
            }, {});
        }

        return await this.model.findMany(query);
    }

    async Create(entity: Partial<T>): Promise<T>
    {
        return await this.model.create({
            data: entity
        });
    }

    async Update(id: number, entity: Partial<T>): Promise<T>
    {
        return await this.model.update({
            where: { id },
            data: entity
        });
    }

    async Delete(id: number): Promise<T>
    {
        return await this.model.delete({
            where: { id }
        });
    }

    async DeleteList(ids: number[]): Promise<number>
    {
        const result = await this.model.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
        return result.count;
    }
}
