import { User } from "../../Entities/Models/User";
import { PagedList } from "../../Entities/RequestFeatures/Core/PagedList";
import { UserParameter } from "../../Entities/RequestFeatures/UserParameter";

export interface IUserRepository
{
    GetUserByEmail(email: string): Promise<User | null>;
    GetUserById(id: number): Promise<User | null>;
    GetListUser(parameters: UserParameter): Promise<PagedList<User>>;
    CreateUser(user: User): Promise<User>;
    UpdateUser(user: Partial<User>): Promise<User>;
    DeleteUser(id: number): Promise<void>;
}
