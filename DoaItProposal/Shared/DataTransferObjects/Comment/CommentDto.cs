using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTransferObjects.Comment
{
    public class CommentDto
    {
        public Guid CommentId { get; set; }
        public string CommentText { get; set; }
        public DateTime CreatedAt { get; set; }

        public string UserId { get; set; }

        public Guid ProposalId { get; set; }



    }
}
