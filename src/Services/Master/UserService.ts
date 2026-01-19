import { IRepositoryManager } from "../../Contracts/Repository/Core/IRepositoryManager";
import { UserForCreateDto } from "../../Entities/DataTransferObjects/User/UserForCreateDto";
import { UserForUpdateDto } from "../../Entities/DataTransferObjects/User/UserForUpdateDto";
import { UserDto } from "../../Entities/DataTransferObjects/User/UserDto";
import { User } from "../../Entities/Models/User";
import { MetaData } from "../../Entities/RequestFeatures/Core/MetaData";
import { UserParameter } from "../../Entities/RequestFeatures/UserParameter";
import { IUserService } from "../../Services.Contracts/Master";
import { ICoreAdapterManager } from "../CoreAdapterManager";
import { UserNotFoundException } from "../../Entities/Exceptions/User/UserNotFoundException";
import { UserDuplicateBadRequestException } from "../../Entities/Exceptions/User/UserDuplicateBadRequstException";
import { Mapper } from '@automapper/core';

export class UserService implements IUserService
{
    private static readonly SystemPlaceholder = "System";

    private readonly _repositoryManager: IRepositoryManager;
    private readonly _mapper: Mapper;

    constructor(coreAdapterManager: ICoreAdapterManager)
    {
        this._repositoryManager = coreAdapterManager.repositoryManager;
        this._mapper = coreAdapterManager.mapper;
    }

    private async GetUserAndCheckIfItExists(id: number, trackChanges: boolean): Promise<User>
    {
        const userEntity = await this._repositoryManager.userRepository.GetUserById(id);

        if (!userEntity)
        {
            throw new UserNotFoundException(id);
        }

        return userEntity;
    }

    public async GetListUser(parameters: UserParameter, trackChanges: boolean): Promise<{ users: User[]; metaData: MetaData; }>
    {
        const pagedUsers = await this._repositoryManager.userRepository.GetListUser(parameters);

        return {
            users: pagedUsers,
            metaData: pagedUsers.MetaData
        };
    }

    async GetUser(id: number): Promise<UserDto>
    {
        const userEntity = await this.GetUserAndCheckIfItExists(id, false);
        const userDto = this._mapper.map(userEntity, User, UserDto);
        return userDto;
    }

    async CreateUser(userForCreateDto: UserForCreateDto): Promise<UserDto>
    {
        if (!userForCreateDto)
        {
            throw new Error("User data cannot be null.");
        }

        const existingUser = await this._repositoryManager.userRepository.GetUserByEmail(userForCreateDto.Email);

        if (existingUser)
        {
            throw new UserDuplicateBadRequestException(userForCreateDto.Email);
        }

        // Use mapper to convert DTO to Entity
        const userEntity = this._mapper.map(userForCreateDto, UserForCreateDto, User);

        const dateNow = new Date();
        userEntity.CreatedAt = dateNow;
        userEntity.UpdatedAt = dateNow;
        userEntity.CreatedBy = UserService.SystemPlaceholder;
        userEntity.UpdatedBy = UserService.SystemPlaceholder;

        try
        {
            const createdUser = await this._repositoryManager.userRepository.CreateUser(userEntity);

            const userDto = this._mapper.map(createdUser, User, UserDto);
            return userDto;
        }
        catch (error: any)
        {
            if (error.code === 'P2002')
            {
                throw new UserDuplicateBadRequestException(userForCreateDto.Email);
            }
            throw error;
        }
    }

    async UpdateUser(id: number, userForUpdateDto: UserForUpdateDto): Promise<UserDto>
    {
        const userEntity = await this.GetUserAndCheckIfItExists(id, true);

        if (userForUpdateDto.Email !== userEntity.Email)
        {
            const existingUser = await this._repositoryManager.userRepository.GetUserByEmail(userForUpdateDto.Email);

            if (existingUser && existingUser.Id !== id)
            {
                throw new UserDuplicateBadRequestException(userForUpdateDto.Email);
            }
        }

        const dateNow = new Date();
        userEntity.UpdatedBy = UserService.SystemPlaceholder;
        userEntity.UpdatedAt = dateNow;

        // Use mapper for partial update
        this._mapper.map(userForUpdateDto, UserForUpdateDto, User);

        try
        {
            await this._repositoryManager.userRepository.UpdateUser(userEntity);
        }
        catch (error: any)
        {
            if (error.code === 'P2002')
            {
                throw new UserDuplicateBadRequestException(userForUpdateDto.Email);
            }
            throw error;
        }

        return this._mapper.map(userEntity, User, UserDto);
    }

    async DeleteUser(id: number): Promise<void>
    {
        await this.GetUserAndCheckIfItExists(id, false);
        await this._repositoryManager.userRepository.DeleteUser(id);
    }

    async DeleteUserCollection(ids: number[]): Promise<void>
    {
        for (const id of ids)
        {
            await this.DeleteUser(id);
        }
    }
}
