using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Exceptions
{
    public class NotFoundException : Exception
    {
        
    
        public NotFoundException(string message) : base(message) { }

        
        

        public NotFoundException(string name, Guid id) : base($" \"{name}\" with ({id}) was not found.")
        {

        }
    }
}
