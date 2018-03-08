
using System;
using System.Linq;
using System.Web;
using System.Web.UI;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Collections.Specialized;
using Newtonsoft.Json;

namespace PBIWebApp
{
    /* NOTE: This sample is to illustrate how to authenticate a Power BI web app. 
    * In a production application, you should provide appropriate exception handling and refactor authentication settings into 
    * a configuration. Authentication settings are hard-coded in the sample to make it easier to follow the flow of authentication. */
    public partial class _Default : Page
    {
        public const string authResultString = "authResult";
        public AuthenticationResult authResult { get; set; }
        string baseUri = Properties.Settings.Default.PowerBiDataset;

        protected void Page_Load(object sender, EventArgs e)
        {

            //Test for AuthenticationResult
            if (Session[authResultString] != null)
            {
                //Get the authentication result from the session
                authResult = (AuthenticationResult)Session[authResultString];

                //Show Power BI Panel
                signInStatus.Visible = true;
                signInButton.Visible = false;
                signOffButton.Visible = true;

                //Set user and token from authentication result
                userLabel.Text = authResult.UserInfo.DisplayableId;
                accessTokenTextbox.Text = authResult.AccessToken;
            }
            else
            {
                signOffButton.Visible = false;
            }
        }

        protected void signInButton_Click(object sender, EventArgs e)
        {
            //Create a query string
            //Create a sign-in NameValueCollection for query string
            var @params = new NameValueCollection
            {
                //Azure AD will return an authorization code. 
                //See the Redirect class to see how "code" is used to AcquireTokenByAuthorizationCode
                {"response_type", "code"},

                //Client ID is used by the application to identify themselves to the users that they are requesting permissions from. 
                //You get the client id when you register your Azure app.
                {"client_id", Properties.Settings.Default.ClientID},

                //Resource uri to the Power BI resource to be authorized
                {"resource", Properties.Settings.Default.PowerBiAPI},

                //After user authenticates, Azure AD will redirect back to the web app
                {"redirect_uri", "http://localhost:13526/redirect"}
            };

            //Create sign-in query string
            var queryString = HttpUtility.ParseQueryString(string.Empty);
            queryString.Add(@params);

            //Redirect authority
            //Authority Uri is an Azure resource that takes a client id to get an Access token
            string authorityUri = Properties.Settings.Default.AADAuthoritySignInUri;
            var authUri = String.Format("{0}?{1}", authorityUri, queryString);
            Response.Redirect(authUri);
        }

        protected void signOffButton_Click(object sender, EventArgs e)
        {
            //Create a query string
            //Create a sign-in NameValueCollection for query string
            var @params = new NameValueCollection
            {
                //Client ID is used by the application to identify themselves to the users that they are requesting permissions from. 
                //You get the client id when you register your Azure app.
                {"client_id", Properties.Settings.Default.ClientID},

                //Resource uri to the Power BI resource to be authorized
                {"resource", Properties.Settings.Default.PowerBiAPI},

                //After user authenticates, Azure AD will redirect back to the web app
                {"redirect_uri", "http://localhost:13526/"},

                //After user authenticates, Azure AD will redirect back to the web app
                {"post_logout_redirect_uri", "http://localhost:13526/redirect"}
            };

            //Create sign-in query string
            var queryString = HttpUtility.ParseQueryString(string.Empty);
            queryString.Add(@params);

            //Redirect authority
            //Authority Uri is an Azure resource that takes a client id to get an Access token
            string authorityUri = Properties.Settings.Default.AADAuthoritySignOffUri;
            var authUri = String.Format("{0}?{1}", authorityUri, queryString);
            Response.Redirect(authUri);
        }

        protected void getDashboardsButton_Click(object sender, EventArgs e)
        {
            string responseContent = string.Empty;

            //Configure dashboards request
            System.Net.WebRequest request = System.Net.WebRequest.Create(String.Format("{0}dashboards", baseUri)) as System.Net.HttpWebRequest;
            request.Method = "GET";
            request.ContentLength = 0;
            request.Headers.Add("Authorization", String.Format("Bearer {0}", authResult.AccessToken));

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

    public class PBIDashboards
    {
        public PBIDashboard[] value { get; set; }
    }

    public class PBIDashboard
    {
        public string id { get; set; }
        public string displayName { get; set; }
        public string embedUrl { get; set; }
        public bool isReadOnly { get; set; }
    }
}