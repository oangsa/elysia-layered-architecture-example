import { RequestParameters } from "./Core/RequestParameters";

export class UserParameter extends RequestParameters
{
    constructor()
    {
        super();
        this.OrderBy = "Id";
    }
}
