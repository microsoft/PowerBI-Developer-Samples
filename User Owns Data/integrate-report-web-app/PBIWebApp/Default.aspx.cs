using System;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Collections.Specialized;
using PBIWebApp.Properties;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using Microsoft.Rest;

namespace PBIWebApp
{
    /* NOTE: This code is for sample purposes only. In a production application, you could use a MVC design pattern.
    * In addition, you should provide appropriate exception handling and refactor authentication settings into 
    * a secure configuration. Authentication settings are hard-coded in the sample to make it easier to follow the flow of authentication. 
    * In addition, the sample uses a single web page so that all code is in one location. However, you could refactor the code into
    * your own production model.
    */
    public partial class _Default : Page
    {
        string baseUri = Settings.Default.PowerBiDataset;

        protected void Page_Load(object sender, EventArgs e)
        {

            //Need an Authorization Code from Azure AD before you can get an access token to be able to call Power BI operations
            //You get the Authorization Code when you click Get Report (see below).
            //After you call AcquireAuthorizationCode(), Azure AD redirects back to this page with an Authorization Code.
            if (Request.Params.Get("code") != null)
            {
                //After you get an AccessToken, you can call Power BI API operations such as Get Report
                Session["AccessToken"] = GetAccessToken(
                    Request.Params.GetValues("code")[0],
                    Settings.Default.ClientID,
                    Settings.Default.ClientSecret,
                    Settings.Default.RedirectUrl);

                //Redirect again to get rid of code=
                Response.Redirect("/Default.aspx");
            }

            //After the redirect above to get rid of code=, Session["authResult"] does not equal null, which means you have an
            //Access Token. With the Acccess Token, you can call the Power BI Get Reports operation. Get Reports returns information
            //about a Report, not the actual Report visual. You get the Report visual later with some JavaScript. See postActionLoadReport()
            //in Default.aspx.
            if (Session["AccessToken"] != null)
            {
                //You need the Access Token in an HTML element so that the JavaScript can load a Report visual into an IFrame.
                //Without the Access Token, you can not access the Report visual.
                accessToken.Value = Session["AccessToken"].ToString();

                //In this sample, you get the first Report. In a production app, you would create a more robost
                //solution

                //Gets the corresponding report to the setting's ReportId and GroupId.
                //If reportId or groupId are empty or invalid, it will get the first user's report.
                GetReport();
            }
        }

        protected void getReportButton_Click(object sender, EventArgs e)
        {
            //You need an Authorization Code from Azure AD so that you can get an Access Token
            //Values are hard-coded for sample purposes.
            GetAuthorizationCode();
        }


        //Get a Report. In this sample, you get the first Report.
        protected void GetReport()
        {
            var groupId = Settings.Default.GroupId;
            var reportId = Settings.Default.ReportId;
            var powerBiApiUrl = Settings.Default.PowerBiApiUrl;

            using (var client = new PowerBIClient(new Uri(powerBiApiUrl), new TokenCredentials(accessToken.Value, "Bearer")))
            {
                var groups = client.Groups.GetGroups();
                var sourceGroup = groups.Value.FirstOrDefault(g => g.Id == groupId);
                if (sourceGroup == null)
                {
                    sourceGroup = groups.Value.FirstOrDefault();
                }

                if(sourceGroup == null)
                {
                    return;
                }

                // Get a list of reports.
                var reports = client.Reports.GetReportsInGroup(sourceGroup.Id);

                Report report;
                if (string.IsNullOrEmpty(reportId))
                {
                    // Get the first report in the group.
                    report = reports.Value.FirstOrDefault();
                }
                else
                {
                    report = reports.Value.FirstOrDefault(r => r.Id == reportId);
                }

                if (report != null)
                {
                    txtEmbedUrl.Text = report.EmbedUrl;
                    txtReportId.Text = report.Id;
                    txtReportName.Text = report.Name;
                }
            }
        }

        public void GetAuthorizationCode()
        {
            //NOTE: Values are hard-coded for sample purposes.
            //Create a query string
            //Create a sign-in NameValueCollection for query string
            var @params = new NameValueCollection
            {
                //Azure AD will return an authorization code. 
                {"response_type", "code"},

                //Client ID is used by the application to identify themselves to the users that they are requesting permissions from. 
                //You get the client id when you register your Azure app.
                {"client_id", Settings.Default.ClientID},

                //Resource uri to the Power BI resource to be authorized
                //The resource uri is hard-coded for sample purposes
                {"resource", Settings.Default.PowerBiAPIResource},

                //After app authenticates, Azure AD will redirect back to the web app. In this sample, Azure AD redirects back
                //to Default page (Default.aspx).
                { "redirect_uri", Settings.Default.RedirectUrl}
            };

            //Create sign-in query string
            var queryString = HttpUtility.ParseQueryString(string.Empty);
            queryString.Add(@params);

            //Redirect to Azure AD Authority
            //  Authority Uri is an Azure resource that takes a client id and client secret to get an Access token
            //  QueryString contains 
            //      response_type of "code"
            //      client_id that identifies your app in Azure AD
            //      resource which is the Power BI API resource to be authorized
            //      redirect_uri which is the uri that Azure AD will redirect back to after it authenticates

            //Redirect to Azure AD to get an authorization code
            Response.Redirect(String.Format(Settings.Default.AADAuthorityUri + "?{0}", queryString));
        }

        public string GetAccessToken(string authorizationCode, string clientID, string clientSecret, string redirectUri)
        {
            //Redirect uri must match the redirect_uri used when requesting Authorization code.
            //Note: If you use a redirect back to Default, as in this sample, you need to add a forward slash
            //such as http://localhost:13526/

            // Get auth token from auth code       
            TokenCache TC = new TokenCache();

            //Values are hard-coded for sample purposes
            string authority = Settings.Default.AADAuthorityUri;
            AuthenticationContext AC = new AuthenticationContext(authority, TC);
            ClientCredential cc = new ClientCredential(clientID, clientSecret);

            //Set token from authentication result
            return AC.AcquireTokenByAuthorizationCode(
                authorizationCode,
                new Uri(redirectUri), cc).AccessToken;
        }
    }
}