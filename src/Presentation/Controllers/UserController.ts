import { Elysia } from 'elysia';
import { UserForCreateDto, UserForUpdateDto } from '../../Entities/DataTransferObjects';
import { UserNotFoundException, UserDuplicateBadRequestException } from '../../Entities/Exceptions';
import { IServiceManager } from '../../Services.Contracts/Core/IServiceManager';
import { Search, SearchTerm, UserParameter } from '../../Entities/RequestFeatures';
import { UserParameterSchema, UserForCreateSchema, UserForUpdateSchema, UserIdParamSchema, DeleteCollectionSchema } from '../Schemas/UserSchemas';

export class UserController
{
    private readonly _service: IServiceManager;

    constructor(service: IServiceManager)
    {
        this._service = service;
    }

    public RegisterRoutes(app: Elysia): void
    {
        app.group('/api/users', (app) =>
            app
                /// <summary>
                /// Gets the list of Users with pagination
                /// </summary>
                /// <param name="param">UserParameters</param>
                /// <returns>List of UserDto with pagination metadata</returns>
                .post('/search', async ({ body, set }) => {
                    try
                    {
                        const parameters = new UserParameter();
                        parameters.PageNumber = body.pageNumber || 1;
                        parameters.PageSize = body.pageSize || 10;
                        parameters.OrderBy = body.orderBy;
                        parameters.Deleted = body.deleted;

                        if (body.search)
                        {
                            parameters.Search = body.search.map(s => {
                                const search = new Search();
                                search.Alias = s.alias;
                                search.Name = s.name;
                                search.Condition = s.condition;
                                search.Value = s.value;
                                return search;
                            });
                        }

                        if (body.searchTerm) {
                            const term = new SearchTerm();
                            term.Alias = body.searchTerm.alias;
                            term.Name = body.searchTerm.name;
                            term.Value = body.searchTerm.value;
                            parameters.SearchTerm = term;
                        }

                        const result = await this._service.userService.GetListUser(parameters, false);

                        set.headers['X-Pagination'] = JSON.stringify(result.metaData);
                        set.status = 200;

                        return structuredClone(result.users);
                    }
                    catch (error: any)
                    {
                        return this.HandleError(error, set);
                    }
                },
                {
                    body: UserParameterSchema,
                    detail: {
                        summary: 'Gets the list of Users',
                        tags: ['Users'],
                        responses: {
                            200: { description: 'Success - Returns list of users' },
                            400: { description: 'Bad Request' },
                            500: { description: 'Internal Server Error' }
                        }
                    }
                })

                /// <summary>
                /// Get User by ID
                /// </summary>
                /// <param name="id">User ID</param>
                /// <returns>UserDto</returns>
                .get('/:id', async ({ params, set }) => {
                    try {
                        const id = Number.parseInt(params.id);
                        const user = await this._service.userService.GetUser(id);

                        if (!user)
                            throw new UserNotFoundException(id);

                        set.status = 200;
                        return structuredClone(user);
                    }
                    catch (error: any)
                    {
                        return this.HandleError(error, set);
                    }
                },
                {
                    params: UserIdParamSchema,
                    detail: {
                        summary: 'Get User by ID',
                        tags: ['Users'],
                        responses: {
                            200: { description: 'Success - Returns user' },
                            404: { description: 'User not found' },
                            500: { description: 'Internal Server Error' }
                        }
                    }
                })

                /// <summary>
                /// Create new User
                /// </summary>
                /// <param name="user">UserForCreateDto</param>
                /// <returns>Created UserDto</returns>
                .post('/', async ({ body, set }) => {
                    try
                    {
                        const userForCreateDto = Object.assign(new UserForCreateDto(), {
                            Email: body.email,
                            Name: body.name,
                            Password: body.password
                        });

                        const createdUser = await this._service.userService.CreateUser(userForCreateDto);

                        set.status = 201;
                        set.headers['Location'] = `/api/users/${createdUser.Id}`;

                        return structuredClone(createdUser);
                    }
                    catch (error: any) {
                        return this.HandleError(error, set);
                    }

                },
                {
                    body: UserForCreateSchema,
                    detail: {
                        summary: 'Create new User',
                        tags: ['Users'],
                        responses: {
                            201: { description: 'Created - User created successfully' },
                            400: { description: 'Bad Request - Validation failed or duplicate email' },
                            500: { description: 'Internal Server Error' }
                        }
                    }
                })

                /// <summary>
                /// Delete User
                /// </summary>
                /// <param name="id">User ID</param>
                /// <returns>NoContent</returns>
                .delete('/:id', async ({ params, set }) => {
                    try
                    {
                        const id = Number.parseInt(params.id);
                        await this._service.userService.DeleteUser(id);

                        set.status = 204;
                        return;
                    }
                    catch (error: any)
                    {
                        return this.HandleError(error, set);
                    }
                }, {
                    params: UserIdParamSchema,
                    detail: {
                        summary: 'Delete User',
                        tags: ['Users'],
                        responses: {
                            204: { description: 'No Content - User deleted successfully' },
                            404: { description: 'User not found' },
                            500: { description: 'Internal Server Error' }
                        }
                    }
                })

                /// <summary>
                /// Deletes the List of Users
                /// </summary>
                /// <param name="ids">Array of User IDs</param>
                /// <returns>NoContent</returns>
                .delete('/collection', async ({ body: { ids }, set }) => {
                    try
                    {
                        const parsedIds = ids.map(id => Number.parseInt(id));
                        await this._service.userService.DeleteUserCollection(parsedIds);

                        set.status = 204;
                        return;
                    }
                    catch (error: any) {
                        return this.HandleError(error, set);
                    }
                }, {
                    body: DeleteCollectionSchema,
                    detail: {
                        summary: 'Deletes the List of Users',
                        tags: ['Users'],
                        responses: {
                            204: { description: 'No Content - Users deleted successfully' },
                            404: { description: 'One or more users not found' },
                            500: { description: 'Internal Server Error' }
                        }
                    }
                })

                /// <summary>
                /// Update User
                /// </summary>
                /// <param name="id">User ID</param>
                /// <param name="user">UserForUpdateDto</param>
                /// <returns>NoContent</returns>
                .put('/:id', async ({ params, body, set }) => {
                    try
                    {
                        const id = Number.parseInt(params.id);

                        const userForUpdateDto = Object.assign(new UserForUpdateDto(), {
                            Email: body.email,
                            Name: body.name,
                            Password: body.password || ''
                        });

                        await this._service.userService.UpdateUser(id, userForUpdateDto);

                        set.status = 204;
                        return;
                    }
                    catch (error: any) {
                        return this.HandleError(error, set);
                    }

                },
                {
                    params: UserIdParamSchema,
                    body: UserForUpdateSchema,
                    detail: {
                        summary: 'Update User',
                        tags: ['Users'],
                        responses: {
                            204: { description: 'No Content - User updated successfully' },
                            400: { description: 'Bad Request - Validation failed or duplicate email' },
                            404: { description: 'User not found' },
                            500: { description: 'Internal Server Error' }
                        }
                    }
                })
        );
    }


    private HandleError(error: any, set: any)
    {
        if (error instanceof UserNotFoundException)
        {
            set.status = 404;
            return {
                statusCode: 404,
                message: error.message,
                error: 'Not Found'
            };
        }

        if (error instanceof UserDuplicateBadRequestException)
        {
            set.status = 400;
            return {
                statusCode: 400,
                message: error.message,
                error: 'Bad Request'
            };
        }

        set.status = 500;
        return {
            statusCode: 500,
            message: error.message || 'An unexpected error occurred',
            error: 'Internal Server Error'
        };
    }
}
