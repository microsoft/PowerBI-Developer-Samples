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
    public partial class _Default : System.Web.UI.Page
    {
        string baseUri = Settings.Default.PowerBiDataset;

        protected void Page_Load(object sender, EventArgs e)
        {
        }

        protected void embedReportButton_Click(object sender, EventArgs e)
        {
            Response.Redirect("/EmbedReport.aspx");
        }

        protected void embedDashboardButton_Click(object sender, EventArgs e)
        {
            Response.Redirect("/EmbedDashboard.aspx");
        }

        protected void embedTileButton_Click(object sender, EventArgs e)
        {
            Response.Redirect("/EmbedTile.aspx");
        }
    }
}