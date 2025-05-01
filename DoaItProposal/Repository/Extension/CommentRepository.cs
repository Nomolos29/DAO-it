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
    public class CommentRepository : RepositoryBase<Comment>, ICommentRepository
    {
        public CommentRepository(RepositoryContext repositoryContext)
            : base(repositoryContext)
        {
        }

        public void CreateComment(Guid proposalId, Comment comment)
        {
            comment.ProposalId = proposalId;
            Create(comment);
        }

        public void DeleteComment(Comment comment) => Delete(comment);

        public async Task<IEnumerable<Comment>> GetAllCommentAsync(Guid proposalId)=> await FindByCondition(x => x.ProposalId.Equals(proposalId)).ToListAsync();
        


        public async Task<Comment> GetCommentAsync(Guid proposalId, Guid commentId) => await
            FindByCondition(x => x.ProposalId.Equals(proposalId) && x.CommentId.Equals(commentId)).FirstOrDefaultAsync();

    }
    
}
