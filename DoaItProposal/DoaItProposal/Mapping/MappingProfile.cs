using AutoMapper;
using Entities.Models;
using Shared.DataTransferObjects.Comment;
using Shared.DataTransferObjects.Proposal;
using Shared.DataTransferObjects.Reaction;

namespace DoaItProposal.Api.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateProposalDto, Proposal>().ForMember(x => x.UploadedFiles, opt => opt.Ignore());
            CreateMap<Proposal, ProposalDto>();
            CreateMap<UpdateProposalDto, Proposal>();

            CreateMap<CreateCommentDto, Comment>().ForMember(c => c.CreatedAt, opt => opt.MapFrom(src =>  DateTime.UtcNow));
            CreateMap<Comment, CommentDto>();   
            CreateMap<UpdateCommentDto, Comment>();

            CreateMap<ProposalReactionDto, ProposalReaction>().ForMember( r => r.CreatedAt, opt => opt.MapFrom(scr => DateTime.UtcNow));

            CreateMap<CommentReactionDto, CommentReaction>().ForMember( c => c.createdAt, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}
