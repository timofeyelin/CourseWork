using Backend.Domain.Entities;

namespace Backend.Application.Interfaces
{
    public interface IPdfGeneratorService
    {
        byte[] GenerateBillPdf(Bill bill);
    }
}