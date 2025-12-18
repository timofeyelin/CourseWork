using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AnnouncementTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsEmergency",
                table: "Announcements");

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Announcements",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "Announcements");

            migrationBuilder.AddColumn<bool>(
                name: "IsEmergency",
                table: "Announcements",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
