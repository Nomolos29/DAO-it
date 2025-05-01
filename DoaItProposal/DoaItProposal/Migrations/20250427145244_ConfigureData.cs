using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoaItProposal.Api.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ProposalType",
                table: "Proposals",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "ProposalStatus",
                table: "Proposals",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "PrivateStatus",
                table: "Proposals",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "FundRaiserOption",
                table: "Proposals",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "AdoptionOption",
                table: "Proposals",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.InsertData(
                table: "Proposals",
                columns: new[] { "ProposalId", "AdoptionOption", "CreatedAt", "EndDate", "FundRaiserOption", "ImageFilePath", "PrivateStatus", "ProposalDetails", "ProposalStatus", "ProposalSummary", "ProposalTitle", "ProposalType", "UserId" },
                values: new object[] { new Guid("e02384c3-32f6-49e0-a2c2-7f21a8a22a74"), "Normal", new DateTime(2025, 4, 27, 0, 30, 15, 0, DateTimeKind.Unspecified), new DateTime(2025, 4, 27, 0, 30, 15, 0, DateTimeKind.Unspecified), "Normal", "[\"path/to/image1.jpg\",\"path/to/image2.jpg\"]", "Group", "Details of Proposal 1", "Private", "Summary of Proposal 1", "Proposal 1", "Adoption", "user1" });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "CommentId", "CommentText", "CreatedAt", "ProposalId", "UserId" },
                values: new object[] { new Guid("309b9099-77e1-470d-ba35-17ae96013740"), "This is a comment", new DateTime(2025, 4, 27, 0, 30, 15, 0, DateTimeKind.Unspecified), new Guid("e02384c3-32f6-49e0-a2c2-7f21a8a22a74"), "user-123" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Comments",
                keyColumn: "CommentId",
                keyValue: new Guid("309b9099-77e1-470d-ba35-17ae96013740"));

            migrationBuilder.DeleteData(
                table: "Proposals",
                keyColumn: "ProposalId",
                keyValue: new Guid("e02384c3-32f6-49e0-a2c2-7f21a8a22a74"));

            migrationBuilder.AlterColumn<int>(
                name: "ProposalType",
                table: "Proposals",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "ProposalStatus",
                table: "Proposals",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "PrivateStatus",
                table: "Proposals",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "FundRaiserOption",
                table: "Proposals",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "AdoptionOption",
                table: "Proposals",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
