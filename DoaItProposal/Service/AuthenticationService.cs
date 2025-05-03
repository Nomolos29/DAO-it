using Contract;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Nethereum.Signer;
using Service.Contracts;
using Shared.DataTransferObjects.Authentication;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    internal sealed class AuthenticationService : IAuthenticationService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;

        public AuthenticationService(IRepositoryManager repositoryManager, UserManager<User> userManager, IConfiguration configuration)
        {
            _repositoryManager = repositoryManager;
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<(bool Success, string? ErrorMessage)> RegisterUser(WalletRegisterDto walletRegisterDto)
        {
            var signer = new EthereumMessageSigner();
            string recoveredAddress = signer.EncodeUTF8AndEcRecover(walletRegisterDto.Message, walletRegisterDto.Signature);

            if (recoveredAddress.ToLower() != walletRegisterDto.WalletAddress.ToLower())
                return (false, "Invalid signature");

            var existingUser = await _userManager.FindByNameAsync(walletRegisterDto.WalletAddress);
            if (existingUser != null)
                return (false, "User already exist");

            var user = new User
            {
                UserName = walletRegisterDto.WalletAddress,
                WalletAddress = walletRegisterDto.WalletAddress,
                EmailConfirmed = true

            };

            var result = await _userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                return (false, errors);
            }

            return (true, null);
        }

        public async Task<(bool success, string errorMessage, string token)> WalletLogin(WalletLoginDto walletLoginDto)
        {
            var signer = new EthereumMessageSigner();
            var recoveredAddress = signer.EncodeUTF8AndEcRecover(walletLoginDto.Message, walletLoginDto.Signature);

            if (recoveredAddress.ToLower() != walletLoginDto.WalletAddress.ToLower())
                return (false, "Invalid signature", null);

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == walletLoginDto.WalletAddress);

            if (user == null)
                return (false, "User not found", null);

            var token = GenerateJwtToken(user);
          
            return (true, null, token);


        }



        private string GenerateJwtToken(IdentityUser user)
        {
            var claims = new[]
            {
                 new Claim(ClaimTypes.NameIdentifier, user.Id),
                 new Claim(ClaimTypes.Name, user.UserName),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }



    }
}
