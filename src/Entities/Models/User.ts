import { AutoMap } from '@automapper/classes';
import { EntityBase } from "./Core/EntityBase";

export class User extends EntityBase
{
    @AutoMap()
    public Name: string = "";

    @AutoMap()
    public Email: string = "";

    @AutoMap()
    public Password: string = "";

    constructor(id: number, createBy: string, name: string, email: string, password: string)
    {
        super(id, createBy);

        this.Name = name;
        this.Email = email;
        this.Password = password;
    }
}
