using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.Proposal
{
    public class UpdateCommentDto
    {
        [Required]
        public string Comment { get; set; }


    }
}
