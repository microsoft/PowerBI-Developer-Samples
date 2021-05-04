// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Controllers
{
	using System;
	using System.Net;
	using System.Security.Claims;
	using System.Web.Mvc;
	using UserOwnsData.Models;
	using UserOwnsData.Services;
	using UserOwnsData.Services.Security;

	public class EmbedInfoController : Controller
	{
		/// <summary>
		/// Returns Embed view when client is authorized
		/// </summary>
		/// <returns>Returns Embed view with authentication details</returns>
		[Authorize]
		public ActionResult Embed()
		{
			try
			{
				var userName = ClaimsPrincipal.Current.FindFirst("name").Value;

				var accessToken = TokenManager.GetAccessToken(PowerBIPermissionScopes.ReadUserWorkspaces);

				AuthDetails authDetails = new AuthDetails
				{
					UserName = userName,
					AccessToken = accessToken
				};

				return View("embed", authDetails);
			}
			catch (Exception ex)
			{
				ErrorModel errorModel = Utils.GetErrorModel((HttpStatusCode)500, ex.ToString());
				return View("Error", errorModel);
			}
		}
	}
}
