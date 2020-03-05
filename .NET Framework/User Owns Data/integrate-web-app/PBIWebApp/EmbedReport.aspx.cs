using System;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Collections.Specialized;
using PBIWebApp.Properties;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.PowerBI.Api;
using Microsoft.PowerBI.Api.Models;
using Microsoft.Rest;

namespace PBIWebApp
{
    /* NOTE: This code is for sample purposes only. In a production application, you could use a MVC design pattern.
    * In addition, you should provide appropriate exception handling and refactor authentication settings into 
    * a secure configuration. Authentication settings are hard-coded in the sample to make it easier to follow the flow of authentication. 
    * In addition, the sample uses a single web page so that all code is in one location. However, you could refactor the code into
    * your own production model.
    */
    public partial class EmbedReport : System.Web.UI.Page
    {
        string baseUri = Settings.Default.PowerBiDataset;

        protected void Page_Load(object sender, EventArgs e)
        {

            //Need an Authorization Code from Azure AD before you can get an access token to be able to call Power BI operations
            //You get the Authorization Code when you click Get Report (see below).
            //After you call AcquireAuthorizationCode(), Azure AD redirects back to this page with an Authorization Code.
            if (Session[Utils.authResultString] != null)
            {
                //Session[Utils.authResultString] does not equal null, which means you have an
                //Access Token. With the Acccess Token, you can call the Power BI Get Reports operation. Get Reports returns information
                //about a Report, not the actual Report visual. You get the Report visual later with some JavaScript. See postActionLoadReport()
                //in Default.aspx.
                accessToken.Value = Utils.authResult.AccessToken;

                //After you get an AccessToken, you can call Power BI API operations such as Get Report
                //In this sample, you get the first Report. In a production app, you would create a more robost
                //solution

                //Gets the corresponding report to the setting's ReportId and WorkspaceId.
                //If ReportId or WorkspaceId are empty, it will get the first user's report.
                GetReport();
            }
        }

        protected void getReportButton_Click(object sender, EventArgs e)
        {
            //You need an Authorization Code from Azure AD so that you can get an Access Token
            //Values are hard-coded for sample purposes.
            Utils.EmbedType = "EmbedReport";
            var urlToRedirect = Utils.GetAuthorizationCode();

            //Redirect to Azure AD to get an authorization code
            Response.Redirect(urlToRedirect);
        }

        // Gets a report based on the setting's ReportId and WorkspaceId.
        // If reportId or WorkspaceId are empty, it will get the first user's report.
        protected void GetReport()
        {
            Guid workspaceId = GetParamGuid(Settings.Default.WorkspaceId);

            Guid reportId = GetParamGuid(Settings.Default.ReportId);

            var powerBiApiUrl = Settings.Default.PowerBiApiUrl;

            using (var client = new PowerBIClient(new Uri(powerBiApiUrl), new TokenCredentials(accessToken.Value, "Bearer")))
            {
                Report report;

                // Settings' workspace ID is not empty
                if (workspaceId != Guid.Empty)
                {
                    // Gets a report from the workspace.
                    report = GetReportFromWorkspace(client, workspaceId, reportId);
                }
                // Settings' report and workspace Ids are empty, retrieves the user's first report.
                else if (reportId == Guid.Empty)
                {
                    report = client.Reports.GetReports().Value.FirstOrDefault();
                    AppendErrorIfReportNull(report, "No reports found. Please specify the target report ID and workspace in the applications settings.");
                }
                // Settings contains report ID. (no workspace ID)
                else
                {
                    report = client.Reports.GetReports().Value.FirstOrDefault(r => r.Id == reportId);
                    AppendErrorIfReportNull(report, $"Report with ID: '{reportId}' not found. Please check the report ID. For reports within a workspace with a workspace ID, add the workspace ID to the application's settings");
                }

                if (report != null)
                {
                    txtEmbedUrl.Text = report.EmbedUrl;
                    txtReportId.Text = report.Id.ToString();
                    txtReportName.Text = report.Name;
                }
            }
        }

        // Gets the report with the specified ID from the workspace. If report ID is emty it will retrieve the first report from the workspace.
        private Report GetReportFromWorkspace(PowerBIClient client, Guid WorkspaceId, Guid reportId)
        {
            // Gets the workspace by WorkspaceId.
            var workspaces = client.Groups.GetGroups();
            var sourceWorkspace = workspaces.Value.FirstOrDefault(g => g.Id == WorkspaceId);

            // No workspace with the workspace ID was found.
            if (sourceWorkspace == null)
            {
                errorLabel.Text = $"Workspace with id: '{WorkspaceId}' not found. Please validate the provided workspace ID.";
                return null;
            }

            Report report = null;
            if (reportId == Guid.Empty)
            {
                // Get the first report in the workspace.
                report = client.Reports.GetReportsInGroup(sourceWorkspace.Id).Value.FirstOrDefault();
                AppendErrorIfReportNull(report, "Workspace doesn't contain any reports.");
            }

            else
            {
                try
                {
                    // retrieve a report by the workspace ID and report ID.
                    report = client.Reports.GetReportInGroup(WorkspaceId, reportId);
                }

                catch (HttpOperationException)
                {
                    errorLabel.Text = $"Report with ID: '{reportId}' not found in the workspace with ID: '{WorkspaceId}', Please check the report ID.";

                }
            }

            return report;
        }

        private void AppendErrorIfReportNull(Report report, string errorMessage)
        {
            if (report == null)
            {
                errorLabel.Text = errorMessage;
            }
        }

        private static Guid GetParamGuid(string param)
        {
            Guid paramGuid = Guid.Empty;
            Guid.TryParse(param, out paramGuid);
            return paramGuid;
        }

    }
}