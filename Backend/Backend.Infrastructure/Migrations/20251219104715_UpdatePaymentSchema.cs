using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePaymentSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Bills_BillId",
                table: "Payment");

            migrationBuilder.AlterColumn<int>(
                name: "BillId",
                table: "Payment",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "AccountId",
                table: "Payment",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Payment_AccountId",
                table: "Payment",
                column: "AccountId");

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Accounts_AccountId",
                table: "Payment",
                column: "AccountId",
                principalTable: "Accounts",
                principalColumn: "AccountId");

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Bills_BillId",
                table: "Payment",
                column: "BillId",
                principalTable: "Bills",
                principalColumn: "BillId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Accounts_AccountId",
                table: "Payment");

            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Bills_BillId",
                table: "Payment");

            migrationBuilder.DropIndex(
                name: "IX_Payment_AccountId",
                table: "Payment");

            migrationBuilder.DropColumn(
                name: "AccountId",
                table: "Payment");

            migrationBuilder.AlterColumn<int>(
                name: "BillId",
                table: "Payment",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Bills_BillId",
                table: "Payment",
                column: "BillId",
                principalTable: "Bills",
                principalColumn: "BillId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
