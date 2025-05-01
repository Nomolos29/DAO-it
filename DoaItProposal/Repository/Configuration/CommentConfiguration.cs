using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Configuration
{
    public class CommentConfiguration : IEntityTypeConfiguration<Comment>
    {
        public void Configure(EntityTypeBuilder<Comment> builder)
        {
            builder.HasData(new Comment
            {
                CommentId = new Guid("309B9099-77E1-470D-BA35-17AE96013740"),
                CommentText = "This is a comment",
                CreatedAt = new DateTime(2025, 4, 27, 0, 30, 15),
                UserId = "user-123",
                ProposalId = new Guid("E02384C3-32F6-49E0-A2C2-7F21A8A22A74")
            });
        }
    }

}
