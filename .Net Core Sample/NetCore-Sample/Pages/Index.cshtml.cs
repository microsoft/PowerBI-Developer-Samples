using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using Microsoft.Rest;

namespace PowerBI_API_NetCore_Sample.Pages
{
    public class IndexModel : PageModel
    {
        public string EmbedUrl { get; set; }
        public string AccessToken { get; set; }
        public string ReportId { get; set; }

        public AppSettings AppSettings { get; }

        public IndexModel(AppSettings appSettings)
        {
            AppSettings = appSettings;
        }

        public async Task OnGet()
        {
            AccessToken = await HttpContext.GetTokenAsync("access_token");
            await EmbedReport();
        }

        private async Task EmbedReport()
        {
            using (var client = new PowerBIClient(new Uri(AppSettings.ApiUrl), new TokenCredentials(AccessToken, "Bearer")))
            {
                string groupId;

                if (string.IsNullOrEmpty(AppSettings.GroupId))
                {
                    // getting first group in GetGroups results
                    groupId = (await client.Groups.GetGroupsAsync()).Value.FirstOrDefault()?.Id;
                }
                else
                {
                    groupId = AppSettings.GroupId;
                }

                if (string.IsNullOrEmpty(groupId))
                {
                    // no groups available for user
                    string message = "No group available, need to create a group and upload a report";
                    Response.Redirect($"Error?message={message}");
                }

                // getting first report in selected group from GetReports results
                Report report = (await client.Reports.GetReportsInGroupAsync(groupId)).Value.FirstOrDefault();

                if (report != null)
                {
                    EmbedUrl = report.EmbedUrl;
                    ReportId = report.Id;
                }
                else
                {
                    // no reports available for user in chosen group
                    // need to upload a report or insert a specific group id in appsettings.json
                    string message = "No report available in workspace with ID " + groupId + ", Please fill a group id with existing report in appsettings.json file";
                    Response.Redirect($"Error?message={message}");
                }
            }
        }
    }
}
