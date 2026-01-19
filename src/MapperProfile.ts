import { createMap, Mapper } from '@automapper/core';
import { User } from './Entities/Models/User';
import { UserDto, UserForCreateDto, UserForUpdateDto } from './Entities/DataTransferObjects';

export class MapperProfile
{
    static configure(mapper: Mapper): void
    {
        // Map User
        createMap(mapper, UserForCreateDto, User);
        createMap(mapper, UserForUpdateDto, User);
        createMap(mapper, User, UserDto);

    }
}
