using System.Configuration;
using Microsoft.ApplicationInsights.Extensibility;

namespace LoadTesting
{
    class Program
    {
        static void Main(string[] args)
        {
            TelemetryConfiguration.Active.InstrumentationKey = ConfigurationManager.AppSettings["iKey"];

            var testSettings = TestSettingsFactory.FromAppConfig();

            var LoadTest = new LoadTest();
            LoadTest.Go(testSettings);
        }
    }
}
