import { t } from 'elysia';

export const UserParameterSchema = t.Object({
    pageNumber: t.Optional(t.Number({ minimum: 1, default: 1 })),
    pageSize: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 10 })),
    orderBy: t.Optional(t.String()),
    search: t.Optional(t.Array(t.Object({
        alias: t.Optional(t.String()),
        name: t.String(),
        condition: t.String(),
        value: t.String()
    }))),
    searchTerm: t.Optional(t.Object({
        alias: t.Optional(t.String()),
        name: t.String(),
        value: t.String()
    })),
    deleted: t.Optional(t.Boolean({ default: false }))
});

export const UserForCreateSchema = t.Object({
    email: t.String({ format: 'email' }),
    name: t.String({ minLength: 1, maxLength: 100 }),
    password: t.String({ minLength: 6, maxLength: 50 })
});

export const UserForUpdateSchema = t.Object({
    email: t.String({ format: 'email' }),
    name: t.String({ minLength: 1, maxLength: 100 }),
    password: t.Optional(t.String({ minLength: 6, maxLength: 50 }))
});

export const UserIdParamSchema = t.Object({
    id: t.String({ pattern: '^[0-9]+$' })
});

export const DeleteCollectionSchema = t.Object({
    ids: t.Array(t.String({ pattern: '^[0-9]+$' }))
});
