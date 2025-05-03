using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DataTransferObjects.Authentication
{
    public class WalletLoginDto
    {
        public string? WalletAddress { get; set; }
        public string? Signature { get; set; }
        public string? Message { get; set; }
    }
}
