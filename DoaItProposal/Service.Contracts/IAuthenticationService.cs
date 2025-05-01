using Shared.DataTransferObjects.Authentication;

namespace Service.Contracts
{
    public interface IAuthenticationService
    {
        Task<(bool Success, string ErrorMessage)> RegisterUser(WalletRegisterDto walletRegisterDto);
        Task<(bool success, string errorMessage, string token)> WalletLogin(WalletLoginDto walletLoginDto);
    }
}
