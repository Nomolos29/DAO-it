using Entities.Enums;
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
    public class ProposalConfiguration : IEntityTypeConfiguration<Proposal>
    {


        public void Configure(EntityTypeBuilder<Proposal> builder)
        {
            builder.HasData(
                new Proposal
                {
                    ProposalId = new Guid("E02384C3-32F6-49E0-A2C2-7F21A8A22A74"), 
                    ProposalTitle = "Proposal 1",
                    AdoptionOption = AdoptionOption.Normal,
                    FundRaiserOption = FundRaiserOption.Normal,
                    ProposalSummary = "Summary of Proposal 1",
                    ProposalDetails = "Details of Proposal 1",
                    ProposalStatus = ProposalStatus.Private,
                    PrivateStatus = PrivateStatus.Group,
                    ProposalType = ProposalType.Adoption,
                    CreatedAt = new DateTime(2025, 4, 27, 0, 30, 15),
                    EndDate = new DateTime(2025, 4, 27, 0, 30, 15),
                    UserId = "user1",
                    UploadedFiles = new List<string> { "path/to/image1.jpg", "path/to/image2.jpg" }


                });
        }
    }

}
