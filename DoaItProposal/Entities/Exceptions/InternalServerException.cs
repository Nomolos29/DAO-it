namespace Entities.Exceptions
{
    public class InternalServerException : Exception
    {
        public InternalServerException(string message) : base(message)
        {

        }

        public InternalServerException(string nessage, string details) : base(nessage)
        {
            Details = details;
        }

        public string? Details { get; }
    }
}
