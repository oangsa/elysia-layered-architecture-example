import { Search } from "./Search";
import { SearchTerm } from "./SearchTerm";

export abstract class RequestParameters
{
    private static readonly MaxPageSize: number = 50;

    public PageNumber: number = 1;

    private _pageSize: number = 10;
    private _isDownload?: boolean = false;

    public get PageSize(): number
    {
        return this._pageSize;
    }

    public set PageSize(value: number)
    {
        if (value === 999)
        {
            this._pageSize = value;
            return;
        }

        if (this._isDownload !== true && value > RequestParameters.MaxPageSize)
        {
            this._pageSize = RequestParameters.MaxPageSize;
        }
        else
        {
            this._pageSize = value;
        }

    }

    public Search?: Array<Search>;

    public SearchTerm?: SearchTerm;

    public OrderBy?: string;

    public Deleted?: boolean = false;

    public SetIsDownload(isDownload?: boolean): void
    {
        this._isDownload = isDownload;
        this.PageSize = Number.MAX_SAFE_INTEGER;
    }

}
