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
using Newtonsoft.Json;

namespace PBIWebApp
{
    /* NOTE: This code is for sample purposes only. In a production application, you could use a MVC design pattern.
    * In addition, you should provide appropriate exception handling and refactor authentication settings into 
    * a secure configuration. Authentication settings are hard-coded in the sample to make it easier to follow the flow of authentication. 
    * In addition, the sample uses a single web page so that all code is in one location. However, you could refactor the code into
    * your own production model.
    */
    public partial class EmbedTile : System.Web.UI.Page
    {
        string baseUri = Properties.Settings.Default.PowerBiDataset;
        public AuthenticationResult authResult { get; set; }

        protected void Page_Load(object sender, EventArgs e)
        {

            //Need an Authorization Code from Azure AD before you can get an access token to be able to call Power BI operations
            //You get the Authorization Code when you click Get Tile (see below).
            //After you call AcquireAuthorizationCode(), Azure AD redirects back to this page with an Authorization Code.
            if (Session[Utils.authResultString] != null)
            {
                //After you get an AccessToken, you can call Power BI API operations such as Get Tile
                authResult = (AuthenticationResult)Session[Utils.authResultString];
                accessToken.Value = authResult.AccessToken;

                //Get first dashboard. Sample assumes one dashboard with one tile
                string dashboardId = GetDashboard(0);
                
                //You can get the Dashboard ID with the Get Dashboards operation. Or go to your dashboard, and get it from the url for the dashboard.
                //The dashboard id is at the end if the url. For example, https://msit.powerbi.com/groups/me/dashboards/00b7e871-cb98-48ed-bddc-0000c000e000              
                //In this sample, you get the first tile in the first dashbaord. In a production app, you would create a more robost
                //solution
                GetTile(dashboardId, 0);
            }
        }

        protected void getTileButton_Click(object sender, EventArgs e)
        {
            //You need an Authorization Code from Azure AD so that you can get an Access Token
            //Values are hard-coded for sample purposes.
            Utils.EmbedType = "EmbedTile";
            var urlToRedirect = Utils.GetAuthorizationCode();

            //Redirect to Azure AD to get an authorization code
            Response.Redirect(urlToRedirect);
        }

        //Get a dashbaord id. 
        protected string GetDashboard(int index)
        {
            string dashboardId = string.Empty;

            //Configure tiles request
            System.Net.WebRequest request = System.Net.WebRequest.Create($"{baseUri}groups/{Settings.Default.WorkspaceId}/Dashboards") as System.Net.HttpWebRequest;

            request.Method = "GET";
            request.ContentLength = 0;
            request.Headers.Add("Authorization", $"Bearer {accessToken.Value}");

            //Get dashboards response from request.GetResponse()
            using (var response = request.GetResponse() as System.Net.HttpWebResponse)
            {
                //Get reader from response stream
                using (var reader = new System.IO.StreamReader(response.GetResponseStream()))
                {
                    //Deserialize JSON string
                    PBIDashboards dashboards = JsonConvert.DeserializeObject<PBIDashboards>(reader.ReadToEnd());

                    //Sample assumes at least one Dashboard with one Tile.
                    //You could write an app that lists all tiles in a dashboard
                    dashboardId = dashboards.value[index].id;
                }
            }

            return dashboardId;
        }

        //Get a tile from a dashboard. In this sample, you get the first tile.
        protected void GetTile(string dashboardId, int index)
        {
            //Configure tiles request
            System.Net.WebRequest request = System.Net.WebRequest.Create($"{baseUri}groups/{Settings.Default.WorkspaceId}/Dashboards/{dashboardId}/Tiles") as System.Net.HttpWebRequest;

            request.Method = "GET";
            request.ContentLength = 0;
            request.Headers.Add("Authorization", $"Bearer {accessToken.Value}");

            //Get tiles response from request.GetResponse()
            using (var response = request.GetResponse() as System.Net.HttpWebResponse)
            {
                //Get reader from response stream
                using (var reader = new System.IO.StreamReader(response.GetResponseStream()))
                {
                    //Deserialize JSON string
                    PBITiles tiles = JsonConvert.DeserializeObject<PBITiles>(reader.ReadToEnd());

                    //Sample assumes at least one Dashboard with one Tile.
                    //You could write an app that lists all tiles in a dashboard
                    if (tiles.value.Length > 0)
                        tileEmbedUrl.Text = tiles.value[index].embedUrl;
                }
            }
        }

        public string GetAccessToken(string authorizationCode, string clientID, string clientSecret, string redirectUri)
        {
            //Redirect uri must match the redirect_uri used when requesting Authorization code.
            //Note: If you use a redirect back to Default, as in this sample, you need to add a forward slash
            //such as http://localhost:13526/

            // Get auth token from auth code       
            TokenCache TC = new TokenCache();

            //Values are hard-coded for sample purposes
            string authority = Properties.Settings.Default.AADAuthorityUri;
            AuthenticationContext AC = new AuthenticationContext(authority, TC);
            ClientCredential cc = new ClientCredential(clientID, clientSecret);

            //Set token from authentication result
            return AC.AcquireTokenByAuthorizationCodeAsync(
                authorizationCode,
                new Uri(redirectUri), cc).Result.AccessToken;
        }
    }
}