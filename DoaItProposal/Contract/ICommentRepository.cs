using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contract
{
    public interface ICommentRepository
    {
        Task<IEnumerable<Comment>> GetAllCommentAsync(Guid proposalId);
        Task<Comment> GetCommentAsync(Guid proposalId, Guid commentId);
        void CreateComment(Guid proposalId, Comment comment);
        
        void DeleteComment(Comment comment);
    }
}
