// using System.Runtime.Serialization;

// namespace AXONSAPI.Entities.Exceptions
// {
//     public abstract class NotFoundException : Exception
//     {
//         protected NotFoundException(string message) : base(message)
//         { }
//         protected NotFoundException(SerializationInfo info, StreamingContext context)
//         #pragma warning disable SYSLIB0051 // Type or member is obsolete
//       : base(info, context)
//         #pragma warning restore SYSLIB0051 // Type or member is obsolete
//         {
//         }
//     }
// }

export abstract class NotFoundException extends Error
{
    protected constructor(message: string)
    {
        super(message);
        this.name = 'NotFoundException';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
