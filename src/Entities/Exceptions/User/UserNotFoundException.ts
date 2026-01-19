export class UserNotFoundException extends Error {
    constructor(id: number) {
        super(`User with id ${id} was not found.`);
        this.name = 'UserNotFoundException';
    }
}
