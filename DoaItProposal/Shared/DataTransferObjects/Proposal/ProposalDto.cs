using Entities.Enums;
using Entities.Models;
using Microsoft.AspNetCore.Http;

namespace Shared.DataTransferObjects.Proposal
{
    public class ProposalDto
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

        public ICollection<string> ImageFilePath { get; set; } = new List<string>();

        public DateTime CreatedAt { get; set; }

        public DateTime EndDate { get; set; }

        public ICollection<ProposalReaction> Reactions { get; set; } = new List<ProposalReaction>();



        public string? UserId
        {
            get; set;
        }
    }

}
