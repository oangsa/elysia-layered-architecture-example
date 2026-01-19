import { UserForCreateDto } from "../../Entities/DataTransferObjects/User/UserForCreateDto";
import { UserForUpdateDto } from "../../Entities/DataTransferObjects/User/UserForUpdateDto";
import { MetaData } from "../../Entities/RequestFeatures/Core/MetaData";
import { UserParameter } from "../../Entities/RequestFeatures/UserParameter";
import { User } from "../../Entities/Models/User";
import { UserDto } from "../../Entities/DataTransferObjects/User/UserDto";

export interface IUserService
{
    GetListUser(parameters: UserParameter, trackChanges: boolean): Promise<{ users: User[]; metaData: MetaData }>;
    CreateUser(userForCreateDto: UserForCreateDto): Promise<UserDto>;
    UpdateUser(id: number, userForUpdateDto: UserForUpdateDto): Promise<UserDto>;
    DeleteUser(id: number): Promise<void>;
    DeleteUserCollection(ids: number[]): Promise<void>;
    GetUser(id: number): Promise<UserDto>;
}
