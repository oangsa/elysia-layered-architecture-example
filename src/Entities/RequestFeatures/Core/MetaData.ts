export class MetaData
{
    public CurrentPage: number;
    public TotalPages: number;
    public PageSize: number;
    public TotalCount: number;

    public get HasPrevious(): boolean {
        return this.CurrentPage > 1;
    }
    public get HasNext(): boolean {
        return this.CurrentPage < this.TotalPages;
    }

    constructor(currentPage: number, totalPages: number, pageSize: number, totalCount: number)
    {
        this.CurrentPage = currentPage;
        this.TotalPages = totalPages;
        this.PageSize = pageSize;
        this.TotalCount = totalCount;
    }
}
