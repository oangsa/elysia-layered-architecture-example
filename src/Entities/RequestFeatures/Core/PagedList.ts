import { MetaData } from "./MetaData";

export class PagedList<T> extends Array<T>
{
    public MetaData: MetaData;

    constructor(items: T[], count: number, pageNumber: number, pageSize: number)
    {
        super(...items);

        this.MetaData = new MetaData(
            pageNumber,
            Math.ceil(count / pageSize),
            pageSize,
            count
        );
    }

    public static ToPagedList<U>(source: U[], pageNumber: number, pageSize: number): PagedList<U>
    {
        const count = source.length;
        const items = source
            .slice((pageNumber - 1) * pageSize, (pageNumber - 1) * pageSize + pageSize);

        return new PagedList<U>(items, count, pageNumber, pageSize);
    }
}
