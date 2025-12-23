using Backend.Domain.Entities;
using Backend.Domain.Enums;
using System.Linq;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Backend.Application.Interfaces;

namespace Backend.Application.Services
{

    public class PdfGeneratorService : IPdfGeneratorService
    {
        public PdfGeneratorService()
        {
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public byte[] GenerateBillPdf(Bill bill)
        {
            if (bill?.Account == null || bill.BillItems == null)
            {
                throw new System.ArgumentNullException(nameof(bill), "Bill data is incomplete for PDF generation.");
            }

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12));

                    page.Header()
                        .Text($"Квитанция на оплату услуг")
                        .SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Column(column =>
                        {
                            column.Spacing(20);

                            column.Item().Text($"Лицевой счет: {bill.Account.AccountNumber}");
                            column.Item().Text($"Адрес: {bill.Account.Address}");
                            column.Item().Text($"Период: {bill.Period:MMMM yyyy}");
                            column.Item().Text($"Дата выставления: {bill.CreatedAt:dd.MM.yyyy}");

                            column.Item().PaddingTop(1, Unit.Centimetre).Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(3);
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Element(CellStyle).Text("Услуга");
                                    header.Cell().Element(CellStyle).Text("Тариф");
                                    header.Cell().Element(CellStyle).Text("Объем");
                                    header.Cell().Element(CellStyle).Text("Сумма");

                                    static IContainer CellStyle(IContainer container)
                                    {
                                        return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Black);
                                    }
                                });

                                foreach (var item in bill.BillItems)
                                {
                                    table.Cell().Element(CellStyle).Text(item.ServiceName);
                                    table.Cell().Element(CellStyle).Text($"{item.Tariff:C}");
                                    table.Cell().Element(CellStyle).Text(item.Consumption.ToString("N2"));
                                    table.Cell().Element(CellStyle).Text($"{item.Amount:C}");
                                    
                                    static IContainer CellStyle(IContainer container)
                                    {
                                        return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                                    }
                                }
                            });

                            var isPaid = bill.Payment != null && bill.Payment.Any(p => p.Status == PaymentStatus.Paid);
                            var totalLabel = isPaid ? "Оплачено" : "Итого к оплате";
                            column.Item().AlignRight().Text($"{totalLabel}: {bill.TotalAmount:C}").SemiBold().FontSize(14);
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Страница ");
                            x.CurrentPageNumber();
                        });
                });
            });

            return document.GeneratePdf();
        }
    }
}