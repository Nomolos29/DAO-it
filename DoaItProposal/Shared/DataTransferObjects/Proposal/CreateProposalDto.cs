using Entities.Enums;
using Entities.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTransferObjects.Proposal
{
    public class CreateProposalDto
    {
        public Guid ProposalId { get; set; }

        public string? ProposalTitle { get; set; }
        public string? ProposalSummary { get; set; }

        public string? ProposalDetails { get; set; }

        public ProposalStatus ProposalStatus { get; set; }

        public PrivateStatus PrivateStatus { get; set; }

        public ProposalType ProposalType { get; set; }

        public AdoptionOption AdoptionOption { get; set; }

        public FundRaiserOption FundRaiserOption { get; set; }

        public List<IFormFile>? Images { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime EndDate { get; set; }



        public string? UserId { get; set; }
    }
}
