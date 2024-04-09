// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Services.Security
{
	using Microsoft.Identity.Client;
	using Microsoft.IdentityModel.Tokens;
	using Microsoft.Owin.Security;
	using Microsoft.Owin.Security.Cookies;
	using Microsoft.Owin.Security.Notifications;
	using Microsoft.Owin.Security.OpenIdConnect;
	using Owin;
	using System;
	using System.Configuration;
	using System.Security.Claims;
	using System.Threading.Tasks;

	public class OwinOpenIdConnect
	{
		private static readonly string tenantCommonAuthority = ConfigurationManager.AppSettings["authorityUrl"];
		private static readonly string clientId = ConfigurationManager.AppSettings["clientId"];
		private static readonly string clientSecret = ConfigurationManager.AppSettings["clientSecret"];
		private static readonly string redirectUri = ConfigurationManager.AppSettings["redirectUri"];

		public static void ConfigureAuth(IAppBuilder app)
		{
			app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);

			app.UseCookieAuthentication(new CookieAuthenticationOptions());

			app.UseOpenIdConnectAuthentication(
					new OpenIdConnectAuthenticationOptions
					{
						ClientId = clientId,
						Authority = tenantCommonAuthority,
						TokenValidationParameters = new TokenValidationParameters { ValidateIssuer = false },
						RedirectUri = redirectUri,
						Scope = "openid email profile " + String.Join(" ", PowerBIPermissionScopes.ReadUserWorkspaces),
						PostLogoutRedirectUri = redirectUri,
						Notifications = new OpenIdConnectAuthenticationNotifications()
						{
							AuthorizationCodeReceived = OnAuthorizationCodeCallback
						}
					});
		}

		private static async Task OnAuthorizationCodeCallback(AuthorizationCodeReceivedNotification context)
		{
			ClaimsIdentity userClaims = context.AuthenticationTicket.Identity;
			string userName = userClaims.Name;
			string tenantId = userClaims.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid").Value;

			// Create URL for tenant-specific authority
			string tenantSpecificAuthority = tenantCommonAuthority.Replace("common", tenantId);

			var appConfidential = ConfidentialClientApplicationBuilder.Create(clientId)
												 .WithClientSecret(clientSecret)
												 .WithRedirectUri(redirectUri)
												 .WithAuthority(tenantSpecificAuthority)
												 .Build();

			MSALPerUserMemoryTokenCache userTokenCache = new MSALPerUserMemoryTokenCache(appConfidential.UserTokenCache);

			string[] scopes = PowerBIPermissionScopes.ReadUserWorkspaces;

			IAccount user = appConfidential.GetAccountAsync(userName).Result;

			var authResult = await appConfidential.AcquireTokenByAuthorizationCode(scopes, context.Code).ExecuteAsync();
		}
	}
}
