import { AutoMap } from '@automapper/classes';

export class UserForCreateDto
{
    @AutoMap()
    public readonly Email!: string;

    @AutoMap()
    public readonly Name!: string;

    @AutoMap()
    public readonly Password!: string;
}
