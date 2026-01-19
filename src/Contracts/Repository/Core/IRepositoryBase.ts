export interface IRepositoryBase<T> {
    GetById(id: number): Promise<T | null>;
    GetAll(): Promise<T[]>;
    FindByCondition(condition: Partial<T>, includes?: string[]): Promise<T[]>;
    Create(entity: Partial<T>): Promise<T>;
    Update(id: number, entity: Partial<T>): Promise<T>;
    Delete(id: number): Promise<T>;
    DeleteList(ids: number[]): Promise<number>;
}
