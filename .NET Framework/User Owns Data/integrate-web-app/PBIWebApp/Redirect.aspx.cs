using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Threading.Tasks;

namespace PBIWebApp
{
    public partial class Redirect : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //Redirect uri must match the redirect_uri used when requesting Authorization code.
            string redirectUri = $"{Properties.Settings.Default.RedirectUrl}Redirect";
            string authorityUri = Properties.Settings.Default.AADAuthorityUri;

            // Get the auth code
            string code = Request.Params["code"];

            if (code != null)
            {
                // Get auth token from auth code       
                TokenCache TC = new TokenCache();

                AuthenticationContext AC = new AuthenticationContext(authorityUri, TC);
                ClientCredential cc = new ClientCredential
                    (Properties.Settings.Default.ApplicationID,
                    Properties.Settings.Default.ApplicationSecret);

                AuthenticationResult AR = AC.AcquireTokenByAuthorizationCodeAsync(code, new Uri(redirectUri), cc).Result;

                //Set Session "authResult" index string to the AuthenticationResult
                Session[Utils.authResultString] = AR;

                //Get the authentication result from the session
                Utils.authResult = (AuthenticationResult)Session[Utils.authResultString];

                Response.Redirect($"/{Utils.EmbedType}.aspx");
            }
            else
            {
                //Remove Session "authResult"
                Session[Utils.authResultString] = null;
            }
            //Redirect back to Default.aspx
            Response.Redirect("/Default.aspx");
        }
    }
}