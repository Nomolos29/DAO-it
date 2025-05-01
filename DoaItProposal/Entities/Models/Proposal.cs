using Entities.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class Proposal
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

        public ICollection<string>? UploadedFiles { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime EndDate { get; set; }

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<ProposalReaction> Reactions { get; set; } = new List<ProposalReaction>();

        public string? UserId { get; set; }
    }
}