
using System;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Collections.Specialized;
using Newtonsoft.Json;
using PBIWebApp.Properties;

namespace PBIWebApp
{
    /* NOTE: This sample is to illustrate how to authenticate a Power BI web app. 
    * In a production application, you should provide appropriate exception handling and refactor authentication settings into 
    * a configuration. Authentication settings are hard-coded in the sample to make it easier to follow the flow of authentication. */
    public partial class EmbedDashboard : Page
    {
        string baseUri = Settings.Default.PowerBiDataset;

        protected void Page_Load(object sender, EventArgs e)
        {

            //Test for AuthenticationResult
            if (Session[Utils.authResultString] != null)
            {
                //Show Power BI Panel
                signInStatus.Visible = true;
                signInButton.Visible = false;

                //Set user and token from authentication result
                userLabel.Text = Utils.authResult.Account.Username;
                accessTokenTextbox.Text = Utils.authResult.AccessToken;
            }
        }

        protected void signInButton_Click(object sender, EventArgs e)
        {
            //Redirect to Azure AD to get an authorization code
            Utils.EmbedType = "EmbedDashboard";
            var urlToRedirect = Utils.GetAuthorizationCode();
            Response.Redirect(urlToRedirect);
        }

        protected void getDashboardsButton_Click(object sender, EventArgs e)
        {
            string responseContent = string.Empty;

            //Configure dashboards request
            System.Net.WebRequest request = System.Net.WebRequest.Create($"{baseUri}groups/{Settings.Default.WorkspaceId}/dashboards") as System.Net.HttpWebRequest;
            request.Method = "GET";
            request.ContentLength = 0;
            request.Headers.Add("Authorization", $"Bearer {Utils.authResult.AccessToken}");

            //Get dashboards response from request.GetResponse()
            using (var response = request.GetResponse() as System.Net.HttpWebResponse)
            {
                //Get reader from response stream
                using (var reader = new System.IO.StreamReader(response.GetResponseStream()))
                {
                    responseContent = reader.ReadToEnd();

                    //Deserialize JSON string
                    PBIDashboards PBIDashboards = JsonConvert.DeserializeObject<PBIDashboards>(responseContent);

                    if (PBIDashboards != null)
                    {
                        var gridViewDashboards = PBIDashboards.value.Select(dashboard => new {
                            Id = dashboard.id,
                            DisplayName = dashboard.displayName,
                            EmbedUrl = dashboard.embedUrl
                        });

                        this.GridView1.DataSource = gridViewDashboards;
                        this.GridView1.DataBind();
                    }
                }
            }
        }
    }
}