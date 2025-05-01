using AutoMapper;

namespace DoaItProposal.Api.Mapping
{
    public class EnumToStringConverter<TEnum> : IValueConverter<TEnum, string> where TEnum : struct
    {
        public string Convert(TEnum sourceMember, ResolutionContext context)
        {
            return sourceMember.ToString();
        }
    }
    public class StringToEnumConverter<TEnum> : IValueConverter<string, TEnum> where TEnum : struct
    {
        public TEnum Convert(string sourceMember, ResolutionContext context)
        {
            return Enum.Parse<TEnum>(sourceMember);
        }
    }
}
