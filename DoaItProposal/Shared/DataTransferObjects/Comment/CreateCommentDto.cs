using System.ComponentModel.DataAnnotations;

namespace Shared.DataTransferObjects.Comment
{
    public class CreateCommentDto
    {
        [Required]
        public string CommentText { get; set; }




    }
}
