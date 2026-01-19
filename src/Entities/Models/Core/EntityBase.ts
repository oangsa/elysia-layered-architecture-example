import { AutoMap } from '@automapper/classes';

export abstract class EntityBase
{
    @AutoMap()
    public readonly Id: number;

    @AutoMap()
    public CreatedAt: Date;

    @AutoMap()
    public UpdatedAt: Date;

    @AutoMap()
    public UpdatedBy: string | null;

    @AutoMap()
    public CreatedBy: string;

    protected constructor(id: number, createBy: string)
    {
        this.Id = id;
        this.CreatedBy = createBy;
        this.CreatedAt = new Date();
        this.UpdatedAt = new Date();
        this.UpdatedBy = null;
    }
}
