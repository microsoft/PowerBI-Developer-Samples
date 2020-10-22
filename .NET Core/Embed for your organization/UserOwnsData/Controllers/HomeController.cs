// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Controllers
{
    using UserOwnsData.Service;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Identity.Web;
    using Microsoft.Graph;
    using System.Threading.Tasks;

    [Authorize]
    public class HomeController : Controller
    {
        private readonly GraphServiceClient m_graphServiceClient;

        private readonly ITokenAcquisition m_tokenAcquisition;

        public HomeController(ITokenAcquisition tokenAcquisition,
                              GraphServiceClient graphServiceClient)
        {
            this.m_tokenAcquisition = tokenAcquisition;
            this.m_graphServiceClient = graphServiceClient;
        }

        [AllowAnonymous]
        public IActionResult Index()
        {
            return View();
        }

        // Redirects to login page to request increment consent
        [AuthorizeForScopes(Scopes = new string[] { PowerBiScopes.ReadDashboard, PowerBiScopes.ReadReport, PowerBiScopes.ReadWorkspace })]
        public async Task<IActionResult> Embed()
        {
            // Generate token for the signed in user and store in cache
            await m_tokenAcquisition.GetAccessTokenForUserAsync(new string[] { PowerBiScopes.ReadDashboard, PowerBiScopes.ReadReport, PowerBiScopes.ReadWorkspace });

            // Get username of logged in user
            var userInfo = await m_graphServiceClient.Me.Request().GetAsync();
            var userName = userInfo.DisplayName;
            ViewData["username"] = userName;

            return View();
        }
    }
}
