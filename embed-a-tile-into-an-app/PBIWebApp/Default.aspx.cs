
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Threading.Tasks;
using System.Net.Http;
using System.Collections.Specialized;
using Newtonsoft.Json;

namespace PBIWebApp
{
    /* NOTE: This sample is to illustrate how to authenticate a Power BI web app. 
    * In a production application, you should provide appropriate exception handling and refactor authentication settings into 
    * a secure configuration. Authentication settings are hard-coded in the sample to make it easier to follow the flow of authentication. */
    public partial class _Default : Page
    {
        string baseUri = Properties.Settings.Default.PowerBiDataset;

        public AuthenticationResult authResult { get; set; }

        protected void Page_Load(object sender, EventArgs e)
        {
            //Test for AuthenticationResult
            if (Session["authResult"] != null)
            {
                //Get the authentication result from the session
                authResult = (AuthenticationResult)Session["authResult"];

                //Show Power BI Sign In Panel
                signInStatus.Visible = true;

                //Set user and toek from authentication result
                userLabel.Text = authResult.UserInfo.DisplayableId;
                accessTokenTextbox.Text = authResult.AccessToken;
            }
            else
            {
                PBIPanel.Visible = false;
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
                {"redirect_uri", "http://localhost:13526/Redirect"}
            };

            //Create sign-in query string
            var queryString = HttpUtility.ParseQueryString(string.Empty);
            queryString.Add(@params);

            //Redirect authority
            //Authority Uri is an Azure resource that takes a client id to get an Access token
            string authorityUri = Properties.Settings.Default.AADAuthorityUri;
            Response.Redirect(String.Format("{0}?{1}", authorityUri, queryString));
        }

        protected void getGroupsButton_Click(object sender, EventArgs e)
        {
            string responseContent = string.Empty;

            //Configure groups request
            System.Net.WebRequest request = System.Net.WebRequest.Create(String.Format("{0}groups", baseUri)) as System.Net.HttpWebRequest;
            request.Method = "GET";
            request.ContentLength = 0;
            request.Headers.Add("Authorization", String.Format("Bearer {0}", authResult.AccessToken));

            //Get groups response from request.GetResponse()
            using (var response = request.GetResponse() as System.Net.HttpWebResponse)
            {
                //Get reader from response stream
                using (var reader = new System.IO.StreamReader(response.GetResponseStream()))
                {
                    responseContent = reader.ReadToEnd();

                    //Deserialize JSON string
                    PBIGroups PBIGroups = JsonConvert.DeserializeObject<PBIGroups>(responseContent);

                    tb_GroupsResults.Text = string.Empty;
                    //Get each Group 
                    foreach (PBIGroup grp in PBIGroups.value)
                    {
                        tb_GroupsResults.Text += String.Format("{0}\t{1}\n", grp.id, grp.name);
                    }
                }
            }
        }

        protected void getDatasetsButton_Click(object sender, EventArgs e)
        {
            string responseContent = string.Empty;

            //Configure datasets request
            System.Net.WebRequest request = System.Net.WebRequest.Create(String.Format("{0}datasets", baseUri)) as System.Net.HttpWebRequest;
            request.Method = "GET";
            request.ContentLength = 0;
            request.Headers.Add("Authorization", String.Format("Bearer {0}", authResult.AccessToken));

            //Get datasets response from request.GetResponse()
            using (var response = request.GetResponse() as System.Net.HttpWebResponse)
            {
                //Get reader from response stream
                using (var reader = new System.IO.StreamReader(response.GetResponseStream()))
                {
                    responseContent = reader.ReadToEnd();

                    //Deserialize JSON string
                    PBIDatasets PBIDatasets = JsonConvert.DeserializeObject<PBIDatasets>(responseContent);

                    resultsTextbox.Text = string.Empty;
                    //Get each Dataset from 
                    foreach (Dataset ds in PBIDatasets.Datasets)
                    {
                        resultsTextbox.Text += String.Format("{0}\t{1}\n", ds.Id, ds.Name);
                    }
                }
            }
        }

        //Embed
        protected void getDashboardsButton_Click(object sender, EventArgs e)
        {
            string responseContent = string.Empty;

            //Configure dashboard request
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

                    tb_dashboardsResult.Text = string.Empty;
                    //Get each dashboard 
                    foreach (PBIDashboard db in PBIDashboards.value)
                    {
                        tb_dashboardsResult.Text += String.Format("{0}\t{1}\n", db.id, db.displayName);
                    }
                }
            }
        }

        //Embed
        protected void getTilesButton_Click(object sender, EventArgs e)
        {
            string responseContent = string.Empty;
            string dashboardId = string.Empty;

            if (string.Empty == inDashboardID.Text)
            {
                tb_tilesResult.Text = "Please enter a dashboard id above";
                return;
            }

            dashboardId = inDashboardID.Text;

            //Configure tiles request
            System.Net.WebRequest request = System.Net.WebRequest.Create(String.Format("{0}Dashboards/{1}/Tiles", baseUri, dashboardId)) as System.Net.HttpWebRequest;
            request.Method = "GET";
            request.ContentLength = 0;
            request.Headers.Add("Authorization", String.Format("Bearer {0}", authResult.AccessToken));

            //Get tiles response from request.GetResponse()
            using (var response = request.GetResponse() as System.Net.HttpWebResponse)
            {
                //Get reader from response stream
                using (var reader = new System.IO.StreamReader(response.GetResponseStream()))
                {
                    responseContent = reader.ReadToEnd();

                    //Deserialize JSON string
                    PBITiles PBITiles = JsonConvert.DeserializeObject<PBITiles>(responseContent);

                    tb_tilesResult.Text = string.Empty;
                    //Get each tile from 
                    foreach (PBITile tile in PBITiles.value)
                    {
                        tb_tilesResult.Text += String.Format("{0}\t{1}\t{2}\n", tile.id, tile.title, tile.embedUrl);
                    }
                }
            }
        }

    }

    //Power BI Datasets
    public class PBIDatasets
    {
        public Dataset[] Datasets { get; set; }
    }

    public class PBIGroups
    {
        public PBIGroup[] value { get; set; }
    }

    public class Dataset
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class PBIGroup
    {
        public string id { get; set; }
        public string name { get; set; }
    }

    public class PBIDashboards
    {
        public PBIDashboard[] value { get; set; }
    }
    public class PBIDashboard
    {
        public string id { get; set; }
        public string displayName { get; set; }
    }

    public class PBITiles
    {
        public PBITile[] value { get; set; }
    }
    public class PBITile
    {
        public string id { get; set; }
        public string title { get; set; }
        public string embedUrl { get; set; }
    }

}