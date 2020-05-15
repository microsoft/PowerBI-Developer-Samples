namespace DotNetCorePaaS.Service
{
    using DotNetCorePaaS.Models;
    using Microsoft.Extensions.Options;
    using Microsoft.Identity.Client;
    using System;
    using System.Linq;
    using System.Security;

    public class AadService
    {
        /// <summary>
        /// Generates and returns Access token
        /// </summary>
        /// <param name="appSettings">Contains appsettings.json configuration values</param>
        /// <returns></returns>
        public static string GetAccessToken(IOptions<ConfigurationModel> appSettings)
        {
            AuthenticationResult authenticationResult = null;
            if (appSettings.Value.AuthenticationMode.Equals("masteruser", StringComparison.InvariantCultureIgnoreCase))
            {
                // Create a public client to authorize the app with the AAD app
                IPublicClientApplication clientApp = PublicClientApplicationBuilder.Create(appSettings.Value.ClientId).WithAuthority(appSettings.Value.AuthorityUri).Build();
                var userAccounts = clientApp.GetAccountsAsync().Result;
                try
                {
                    // Retrieve Access token from cache if available
                    authenticationResult = clientApp.AcquireTokenSilent(appSettings.Value.Scope, userAccounts.FirstOrDefault()).ExecuteAsync().Result;
                }
                catch (MsalUiRequiredException)
                {
                    try
                    {
                        SecureString password = new SecureString();
                        foreach (var key in appSettings.Value.PbiPassword)
                        {
                            password.AppendChar(key);
                        }
                        authenticationResult = clientApp.AcquireTokenByUsernamePassword(appSettings.Value.Scope, appSettings.Value.PbiUsername, password).ExecuteAsync().Result;
                    }
                    catch (MsalException)
                    {
                        throw;
                    }
                }
            }
            else if (appSettings.Value.AuthenticationMode.Equals("serviceprincipal", StringComparison.InvariantCultureIgnoreCase))
            {
                // For app only authentication, we need the specific tenant id in the authority url
                var tenantSpecificUrl = appSettings.Value.AuthorityUri.Replace("organizations", appSettings.Value.TenantId);

                // Create a confidetial client to authorize the app with the AAD app
                IConfidentialClientApplication clientApp = ConfidentialClientApplicationBuilder
                                                                                .Create(appSettings.Value.ClientId)
                                                                                .WithClientSecret(appSettings.Value.ClientSecret)
                                                                                .WithAuthority(tenantSpecificUrl)
                                                                                .Build();
                try
                {
                    // Make a client call if Access token is not available in cache
                    authenticationResult = clientApp.AcquireTokenForClient(appSettings.Value.Scope).ExecuteAsync().Result;
                }
                catch (MsalException)
                {
                    throw;
                }
            }

            try
            {
                return authenticationResult.AccessToken;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
