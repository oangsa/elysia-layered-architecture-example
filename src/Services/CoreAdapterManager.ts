import { Mapper } from '@automapper/core';
import { IRepositoryManager } from "../Contracts/Repository/Core/IRepositoryManager";
import { RepositoryManager } from "../Infrastructure/Repository/Core/RepositoryManager";
import { MapperInstance } from '../Infrastructure/Mapper/MapperInstance';

export interface ICoreAdapterManager
{
    repositoryManager: IRepositoryManager;
    mapper: Mapper;
}

export class CoreAdapterManager implements ICoreAdapterManager
{
    private readonly _repositoryManager: IRepositoryManager;
    private readonly _mapper: Mapper;

    constructor()
    {
        this._repositoryManager = new RepositoryManager();
        this._mapper = MapperInstance.Instance;
    }

    get repositoryManager(): IRepositoryManager
    {
        return this._repositoryManager;
    }

    get mapper(): Mapper
    {
        return this._mapper;
    }
}
