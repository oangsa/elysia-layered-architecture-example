export class SearchTerm
{
    public Alias?: string;
    public Name?: string
    public Value?: string;

    constructor(alias?: string, name?: string, value?: string)
    {
        this.Alias = alias;
        this.Name = name;
        this.Value = value;
    }
}
