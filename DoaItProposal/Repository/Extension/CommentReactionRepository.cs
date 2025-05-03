using Contract;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Extension
{


    public class CommentReactionRepository : RepositoryBase<CommentReaction>, ICommentReactionRepository
    {
        public CommentReactionRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public void CreateCommentReaction( Guid commentid, CommentReaction commentReaction)
        {

            commentReaction.CommentId = commentid;
            Create(commentReaction);
        }

        public void DeleteCommentReaction(CommentReaction commentReaction)
        {
            Delete(commentReaction);
        }

        public async Task<CommentReaction?> GetCommentReactionAsync(string userId, Guid commentId
            )
        {
            return await FindByCondition(x => x.UserId.Equals(userId) && x.CommentId.Equals(commentId)).FirstOrDefaultAsync();

        }

        public async Task<IEnumerable<CommentReaction>> GetAllCommentReactionsAsync(Guid commendId)
        {
            return await FindByCondition(x => x.CommentId.Equals(commendId)).ToListAsync();
        }

    }
}
