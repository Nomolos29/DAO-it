

using Microsoft.AspNetCore.Mvc;
using Service.Contracts;
using Shared.DataTransferObjects.Authentication;

namespace Presentation.Controller
{

    [Route("[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IServiceManager _service;

        public AuthenticationController(IServiceManager service)
        {
           _service  = service;
        }

        [HttpPost("register-wallet")]
        public async Task<IActionResult> RegisterWallet([FromBody] WalletRegisterDto dto)
        {
            var (success, errorMessage) = await _service.AuthenticationService.RegisterUser(dto);

            if (!success)
                return BadRequest(new { message = errorMessage });

            return Ok("Wallet user registered successfully");
        }

        [HttpPost("wallet-login")]
        public async Task<IActionResult> WalletLogin([FromBody] WalletLoginDto dto)
        {
            var (success, errorMessage, Token) = await _service.AuthenticationService.WalletLogin(dto);
            if (!success)
                return BadRequest(new { message = errorMessage });

            return Ok(Token);
        }
    }
}
