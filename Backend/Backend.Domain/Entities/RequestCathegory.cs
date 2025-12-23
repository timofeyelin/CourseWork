namespace Backend.Domain.Entities
{
    public class RequestCategory
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public List<Request> Requests { get; set; } = new();
    }
}