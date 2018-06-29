using System.Configuration;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;

namespace LoadTesting
{
    class Program
    {
        static void Main(string[] args)
        {
            TelemetryConfiguration.Active.InstrumentationKey = ConfigurationManager.AppSettings["iKey"];

            var testSettings = new TestSettings
            {
                ReportsRoot =  ConfigurationManager.AppSettings["reportsRoot"],
                ApiUrl = ConfigurationManager.AppSettings["apiUrl"],
                HttpClientTimeoutSeconds = int.Parse(ConfigurationManager.AppSettings["httpClientTimeoutSeconds"]),
                CapacityName = ConfigurationManager.AppSettings["capacityName"],
                GroupNamePrefix =  ConfigurationManager.AppSettings["groupNamePrefix"],
                AuthorityUrl = ConfigurationManager.AppSettings["authorityUrl"],
                ResourceUrl = ConfigurationManager.AppSettings["resourceUrl"],
                ClientId = ConfigurationManager.AppSettings["clientId"],
                PbiUsername = ConfigurationManager.AppSettings["pbiUsername"],
                PbiPassword = ConfigurationManager.AppSettings["pbiPassword"],
                SqlConnectionString = ConfigurationManager.AppSettings["sqlConnectionString"],
                SqlUsername = ConfigurationManager.AppSettings["sqlUsername"],
                SqlPassword = ConfigurationManager.AppSettings["sqlPassword"],
                ImportStatusAttempts = int.Parse(ConfigurationManager.AppSettings["importStatusAttempts"]),
                ImportStatusDelaySeconds = int.Parse(ConfigurationManager.AppSettings["importStatusDelaySeconds"])
            };

            var LoadTest = new LoadTest();
            LoadTest.Go(testSettings);
        }
    }
}
