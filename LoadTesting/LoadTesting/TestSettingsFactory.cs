using System.Configuration;

namespace LoadTesting
{
    public static class TestSettingsFactory
    {
        public static TestSettings FromAppConfig()
        {
            var testSettings = new TestSettings
            {
                ReportsRoot = ConfigurationManager.AppSettings["reportsRoot"],
                ApiVersion = int.Parse(ConfigurationManager.AppSettings["apiVersion"]),
                ApiUrl = ConfigurationManager.AppSettings["apiUrl"],
                HttpClientTimeoutSeconds = int.Parse(ConfigurationManager.AppSettings["httpClientTimeoutSeconds"]),
                CapacityName = ConfigurationManager.AppSettings["capacityName"],
                GroupNamePrefix = ConfigurationManager.AppSettings["groupNamePrefix"],
                AuthorityUrl = ConfigurationManager.AppSettings["authorityUrl"],
                ResourceUrl = ConfigurationManager.AppSettings["resourceUrl"],
                ClientId = ConfigurationManager.AppSettings["clientId"],
                PbiUsername = ConfigurationManager.AppSettings["pbiUsername"],
                PbiPassword = ConfigurationManager.AppSettings["pbiPassword"],
                SqlConnectionString = ConfigurationManager.AppSettings["sqlConnectionString"],
                SqlUsername = ConfigurationManager.AppSettings["sqlUsername"],
                SqlPassword = ConfigurationManager.AppSettings["sqlPassword"],
                ImportStatusAttempts = int.Parse(ConfigurationManager.AppSettings["importStatusAttempts"]),
                ImportStatusDelaySeconds = int.Parse(ConfigurationManager.AppSettings["importStatusDelaySeconds"]),
                CollectionName = ConfigurationManager.AppSettings["workspaceCollectionName"],
                CollectionKey = ConfigurationManager.AppSettings["workspaceCollectionKey"],
                RunInParallel = bool.Parse(ConfigurationManager.AppSettings["runInParallel"]),
                CreateEmbedToken = bool.Parse(ConfigurationManager.AppSettings["createEmbedToken"]),
            };
            return testSettings;
        }
    }
}