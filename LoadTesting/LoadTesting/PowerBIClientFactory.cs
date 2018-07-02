using System;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Rest;

namespace LoadTesting
{
    public static class PowerBIClientFactory
    {
        public static IPowerBIClientWrapper CreatePowerBIClient(TestSettings testSettings)
        {
            return testSettings.ApiVersion == 1
                ? PowerBIClientFactory.CreatePowerBIV1Client(testSettings)
                : PowerBIClientFactory.CreatePowerBIV2Client(testSettings);
        }

        public static IPowerBIClientWrapper CreatePowerBIV2Client(TestSettings testSettings)
        {
            var tokenCredentials = GetUserPasswordTokenCredentials(testSettings).Result;

            var client = new PowerBIV2ClientWrapper(new Uri(testSettings.ApiUrl), tokenCredentials)
            {
                HttpClient =
                {
                    Timeout = TimeSpan.FromSeconds(testSettings.HttpClientTimeoutSeconds)
                },
            };
            return client;
        }

        public static IPowerBIClientWrapper CreatePowerBIV1Client(TestSettings testSettings)
        {
            var tokenCredentials = GetAppKeyTokenCredentials(testSettings);

            var client = new PowerBIV1ClientWrapper(new Uri(testSettings.ApiUrl), tokenCredentials)
            {
                HttpClient =
                {
                    Timeout = TimeSpan.FromSeconds(testSettings.HttpClientTimeoutSeconds)
                },
                CollectionName = testSettings.CollectionName,
                WorkspaceKey = testSettings.CollectionKey
            };
            return client;
        }

        static TokenCredentials GetAppKeyTokenCredentials(TestSettings testSettings)
        {
            var tokenCredentials = new TokenCredentials(testSettings.CollectionKey, "AppKey");
            return tokenCredentials;
        }

        static async Task<TokenCredentials> GetUserPasswordTokenCredentials(TestSettings testSettings)
        {
            var credential = new UserPasswordCredential(testSettings.PbiUsername, testSettings.PbiPassword);
            var authenticationContext = new AuthenticationContext(testSettings.AuthorityUrl);
            var authenticationResult = await authenticationContext.AcquireTokenAsync(testSettings.ResourceUrl, testSettings.ClientId, credential);
            var tokenCredentials = new TokenCredentials(authenticationResult.AccessToken);
            return tokenCredentials;
        }
    }
}