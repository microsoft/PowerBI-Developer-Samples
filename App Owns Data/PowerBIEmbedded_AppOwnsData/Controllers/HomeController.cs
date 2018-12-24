using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using Microsoft.Rest;
using PowerBIEmbedded_AppOwnsData.Models;
using PowerBIEmbedded_AppOwnsData.Services;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PowerBIEmbedded_AppOwnsData.Controllers
{
    public class HomeController : Controller
    {
        private static readonly string Username = ConfigurationManager.AppSettings["pbiUsername"];
        private static readonly string Password = ConfigurationManager.AppSettings["pbiPassword"];
        private static readonly string AuthorityUrl = ConfigurationManager.AppSettings["authorityUrl"];
        private static readonly string ResourceUrl = ConfigurationManager.AppSettings["resourceUrl"];
        private static readonly string ApplicationId = ConfigurationManager.AppSettings["ApplicationId"];
        private static readonly string ApiUrl = ConfigurationManager.AppSettings["apiUrl"];
        private static readonly string WorkspaceId = ConfigurationManager.AppSettings["workspaceId"];
        private static readonly string ReportId = ConfigurationManager.AppSettings["reportId"];

        public HomeController()
        {
            m_embedService = new EmbedService();
        }

        public ActionResult Index()
        {
            return View();
        }

        public async Task<ActionResult> EmbedReport(string username = null, string roles = null)
        {
            var embedResult = await m_embedService.EmbedReport(username, roles);
            if (embedResult)
            {
                return View(m_embedService.EmbedConfig);
            }
            else
            {
                return View(m_embedService.EmbedConfig);
            }
        }

        public async Task<ActionResult> EmbedDashboard()
        {
            var embedResult = await m_embedService.EmbedDashboard();
            if (embedResult)
            {
                return View(m_embedService.EmbedConfig);
            }
            else
            {
                return View(m_embedService.EmbedConfig);
            }
        }

        public async Task<ActionResult> EmbedTile()
        {
            var embedResult = await m_embedService.EmbedTile();
            if (embedResult)
            {
                return View(m_embedService.TileEmbedConfig);
            }
            else
            {
                return View(m_embedService.TileEmbedConfig);
            }
        }

        private AuthenticationResult DoAuthentication()
        {
            var authenticationContext = new AuthenticationContext(AuthorityUrl);
            AuthenticationResult authenticationResult = null;
            if (AuthenticationType.Equals("MasterUser"))
            {
                // Authentication using master user credentials
                var credential = new UserPasswordCredential(Username, Password);
                authenticationResult = authenticationContext.AcquireTokenAsync(ResourceUrl, ApplicationId, credential).Result;
            }
            else
            {
                // Authentication using app credentials
                ClientCredential clientCredential = new ClientCredential(ApplicationId, ApplicationSecret);
                authenticationResult = authenticationContext.AcquireTokenAsync(ResourceUrl, clientCredential).Result;
            }

            return authenticationResult;
        }

        private TokenCredentials GetTokenCredentials(out EmbedConfig result)
        {
            result = new EmbedConfig();
            TokenCredentials tokenCredentials = null;

            var error = GetWebConfigErrors();
            if (error != null)
            {
                result.ErrorMessage = error;
                return tokenCredentials;
            }

            AuthenticationResult authenticationResult = null;
            try
            {
                authenticationResult = DoAuthentication();
            }
            catch (AggregateException exc)
            {
                result.ErrorMessage = exc.InnerException.Message;
                return tokenCredentials;
            }

            if (authenticationResult == null)
            {
                result.ErrorMessage = "Authentication Failed.";
                return tokenCredentials;
            }

            tokenCredentials = new TokenCredentials(authenticationResult.AccessToken, "Bearer");
            return tokenCredentials;
        }
    }

}
