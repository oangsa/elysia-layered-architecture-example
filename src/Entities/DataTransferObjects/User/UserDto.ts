import { AutoMap } from '@automapper/classes';

export class UserDto
{
    @AutoMap()
    public Id: number;

    @AutoMap()
    public Name?: string;

    @AutoMap()
    public Email?: string;

    @AutoMap()
    public CreatedAt!: Date;

    @AutoMap()
    public UpdatedAt!: Date;

    @AutoMap()
    public CreatedBy?: string;

    @AutoMap()
    public UpdatedBy?: string;

    constructor(id: number, name?: string, email?: string, createdBy?: string, updatedBy?: string)
    {
        this.Id = id;
        this.Name = name;
        this.Email = email;
        this.CreatedBy = createdBy;
        this.UpdatedBy = updatedBy;
    }

    ToJSON()
    {
        return {
            Id: this.Id,
            Name: this.Name,
            Email: this.Email,
            CreatedAt: this.CreatedAt,
            UpdatedAt: this.UpdatedAt,
            CreatedBy: this.CreatedBy,
            UpdatedBy: this.UpdatedBy
        };
    }
}
