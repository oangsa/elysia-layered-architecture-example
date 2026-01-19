import { AutoMap } from '@automapper/classes';

export class UserForUpdateDto
{
    @AutoMap()
    readonly Email!: string;

    @AutoMap()
    readonly Name!: string;

    @AutoMap()
    readonly Password!: string;
}
