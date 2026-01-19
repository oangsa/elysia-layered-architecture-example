export class Search
{
    public Alias?: string;
    public Name?: string
    public Condition?: string;
    public Value?: string;

    constructor(alias?: string, name?: string, condition?: string, value?: string)
    {
        this.Alias = alias;
        this.Name = name;
        this.Condition = condition;
        this.Value = value;
    }
}
