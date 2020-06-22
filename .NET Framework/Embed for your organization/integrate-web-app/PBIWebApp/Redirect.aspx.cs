using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Microsoft.Identity.Client;
using System.Threading.Tasks;

namespace PBIWebApp
{
    public partial class Redirect : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //Redirect uri must match the redirect_uri used when requesting Authorization code.
            string redirectUri = $"{Properties.Settings.Default.RedirectUrl}Redirect";
            string authorityUri = Properties.Settings.Default.AADAuthorityUri;

            // Use Tenant Id in single tenant authentication scenario
            string tenantId = Properties.Settings.Default.TenantId;
            Guid emptyGuid = Guid.Empty;

            // Check whether Tenant Id is a valid guid and accordingly take action
            if (!string.IsNullOrWhiteSpace(tenantId) && Guid.TryParse(tenantId, out emptyGuid))
            {
                // Update Authority URI
                authorityUri = authorityUri.Replace("common", tenantId);
            }
            else if (!string.IsNullOrWhiteSpace(tenantId) && !Guid.TryParse(tenantId, out emptyGuid))
            {
                throw new Exception("Please enter a valid Tenant Id in configuration");
            }

            // Get the auth code
            string code = Request.Params["code"];

            if (code != null)
            {
                IConfidentialClientApplication clientApp = ConfidentialClientApplicationBuilder
                                                                                .Create(Properties.Settings.Default.ApplicationID)
                                                                                .WithRedirectUri(redirectUri)
                                                                                .WithAuthority(authorityUri)
                                                                                .WithClientSecret(Properties.Settings.Default.ApplicationSecret)
                                                                                .Build();
                AuthenticationResult authResult = null;
                try
                {
                    string[] scope = new string[Properties.Settings.Default.Scope.Count];
                    Properties.Settings.Default.Scope.CopyTo(scope, 0);
                    authResult = clientApp.AcquireTokenByAuthorizationCode(scope, code).ExecuteAsync().Result;
                }
                catch (MsalException)
                {
                    throw;
                }

                //Set Session "authResult" index string to the AuthenticationResult
                Session[Utils.authResultString] = authResult;

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