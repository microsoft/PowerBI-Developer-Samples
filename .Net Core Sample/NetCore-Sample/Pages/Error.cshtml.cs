using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace PowerBI_API_NetCore_Sample.Pages
{
    public class ErrorModel : PageModel
    {
        public string RequestId { get; set; }
        public string Message { get; set; }

        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

        public void OnGet([FromQuery]string message)
        {
            RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            if (!string.IsNullOrEmpty(message))
            {
                Message = message;
            }
        }
    }
}
