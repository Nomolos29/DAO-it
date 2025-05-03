using Shared.DataTransferObjects.Comment;
using Shared.DataTransferObjects.Proposal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface ICommentService
    {
        Task<bool> CreateCommentAsync(Guid proposalId, CreateCommentDto createCommentDto);
        Task<bool> DeleteCommentAsync(Guid proposalId, Guid commentId);



        Task<CommentDto> GetCommentAsync(Guid proposalId, Guid commentId);

        Task<IEnumerable<CommentDto>> GetAllCommentsAsync(Guid proposalId);

        Task<bool> UpdateCommentAsync(Guid proposalId, Guid commentId, UpdateCommentDto updateCommentDto);


    }
}
