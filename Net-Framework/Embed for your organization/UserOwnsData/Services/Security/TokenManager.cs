// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Services.Security
{
	using Microsoft.Identity.Client;
	using Microsoft.Owin.Security;
	using Microsoft.Owin.Security.Cookies;
	using Microsoft.Owin.Security.OpenIdConnect;
	using System.Configuration;
	using System.Security.Claims;
	using System.Web;

	public class TokenManager
	{
		private static readonly string clientId = ConfigurationManager.AppSettings["clientId"];
		private static readonly string clientSecret = ConfigurationManager.AppSettings["clientSecret"];
		private static readonly string redirectUri = ConfigurationManager.AppSettings["redirectUri"];

		public static string GetAccessToken()
		{
			return GetAccessToken(PowerBIPermissionScopes.ReadUserWorkspaces);
		}

		public static string GetAccessToken(string[] scopes)
		{

			var userClaims = ClaimsPrincipal.Current.Identity as System.Security.Claims.ClaimsIdentity;

			// this is the tenant-specific authorization URL for the Azure AD v2 endpoint
			string tokenIssuerAuthority = ClaimsPrincipal.Current.FindFirst("iss").Value;

			// TenantId is the current organization's ID in Azure AD
			string tenantId = userClaims?.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid")?.Value;

			// objectidentifier is GUID-based identifier for Azure AD User Account of current user
			string currentUserId = userClaims?.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;

			// parse together Home Account ID for current user
			string homeAccountId = currentUserId + "." + tenantId;

			var appConfidential = ConfidentialClientApplicationBuilder.Create(clientId)
														.WithClientSecret(clientSecret)
														.WithRedirectUri(redirectUri)
														.WithAuthority(tokenIssuerAuthority)
														.Build();

			MSALPerUserMemoryTokenCache userTokenCache = new MSALPerUserMemoryTokenCache(appConfidential.UserTokenCache);

			try
			{
				var user = appConfidential.GetAccountAsync(homeAccountId).Result;

				AuthenticationResult authResult = appConfidential.AcquireTokenSilent(scopes, user).ExecuteAsync().Result;

				// return access token back to user
				return authResult.AccessToken;
			}
			catch
			{
				// handle scenario when the user is signed-in browser but msalcache.json is not present on the local system
				// clear cache for current user in token cache
				ClearUserCache();

				// sign out and redirect to home page
				string callbackUrl = redirectUri + "EmbedInfo/Embed";
				HttpContext.Current.GetOwinContext().Authentication.SignOut(
					new AuthenticationProperties { RedirectUri = callbackUrl },
					OpenIdConnectAuthenticationDefaults.AuthenticationType, CookieAuthenticationDefaults.AuthenticationType);
			}

			// return null when token acquisition fails
			return null;
		}

		public static void ClearUserCache()
		{

			var userClaims = ClaimsPrincipal.Current.Identity as System.Security.Claims.ClaimsIdentity;

			// this is the tenant-specific authorization URL for the Azure AD v2 endpoint
			string tokenIssuerAuthority = ClaimsPrincipal.Current.FindFirst("iss").Value;

			// TenantId is the current organization's ID in Azure AD
			string tenantId = userClaims?.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid")?.Value;

			// objectidentifier is GUID-based identifier for Azure AD User Account of current user
			string currentUserId = userClaims?.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;

			// parse together Home Account ID for current user
			string homeAccountId = currentUserId + "." + tenantId;

			var appConfidential = ConfidentialClientApplicationBuilder.Create(clientId)
														.WithClientSecret(clientSecret)
														.WithRedirectUri(redirectUri)
														.WithAuthority(tokenIssuerAuthority)
														.Build();

			// We only clear the user's tokens.
			MSALPerUserMemoryTokenCache userTokenCache = new MSALPerUserMemoryTokenCache(appConfidential.UserTokenCache);

			var user = appConfidential.GetAccountAsync(homeAccountId).Result;
			appConfidential.RemoveAsync(user);
		}
	}
}
