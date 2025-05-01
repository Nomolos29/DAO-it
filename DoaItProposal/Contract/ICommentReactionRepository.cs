using Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Contract
{
    public interface ICommentReactionRepository
    {
        void CreateCommentReaction( Guid commentid, CommentReaction commentReaction);
        void DeleteCommentReaction(CommentReaction commentReaction);
        Task<IEnumerable<CommentReaction>> GetAllCommentReactionsAsync(Guid commendId);
        Task<CommentReaction?> GetCommentReactionAsync(string userId, Guid commentId);
    }
}
