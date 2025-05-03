using Entities.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Repository.Configuration;

namespace Repository.Extension
{
    public class RepositoryContext : IdentityDbContext<User>
    {
        public RepositoryContext(DbContextOptions options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new ProposalConfiguration());
            modelBuilder.ApplyConfiguration(new CommentConfiguration());
        }

        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
           configurationBuilder.Properties<Enum>().HaveConversion<string>();
        }
        public DbSet<Proposal> Proposals { get; set; }
        public DbSet<Comment> Comments { get; set; }

        public DbSet<ProposalReaction> ProposalReactions { get; set; }

        public DbSet<CommentReaction> CommentReactions { get; set; }    




    }
}
