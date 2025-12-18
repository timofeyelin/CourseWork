using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Backend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RequestCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Requests");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Requests",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "RequestCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RequestCategories", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "RequestCategories",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Сантехника" },
                    { 2, "Электрика" },
                    { 3, "Лифт" },
                    { 4, "Уборка" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Requests_CategoryId",
                table: "Requests",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Requests_RequestCategories_CategoryId",
                table: "Requests",
                column: "CategoryId",
                principalTable: "RequestCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Requests_RequestCategories_CategoryId",
                table: "Requests");

            migrationBuilder.DropTable(
                name: "RequestCategories");

            migrationBuilder.DropIndex(
                name: "IX_Requests_CategoryId",
                table: "Requests");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Requests");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Requests",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");
        }
    }
}
