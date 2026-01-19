import { IRepositoryManager } from "../../../Contracts/Repository/Core/IRepositoryManager";
import { IUserRepository } from "../../../Contracts/Repository/IUserRepository";
import { UserRepository } from "../UserRepository";
import { PrismaFactory } from "../../Database/PrismaFactory";

export class RepositoryManager implements IRepositoryManager
{
    private readonly _userRepository: IUserRepository;

    constructor()
    {
        const prisma = PrismaFactory.getInstance();
        this._userRepository = new UserRepository(prisma);
    }

    get userRepository(): IUserRepository {
        return this._userRepository;
    }
}
