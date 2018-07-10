using System;
using System.Configuration;
using Microsoft.ApplicationInsights.Extensibility;

namespace LoadTesting
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("LoadTest started");
            TelemetryConfiguration.Active.InstrumentationKey = ConfigurationManager.AppSettings["iKey"];

            var testSettings = TestSettingsFactory.FromAppConfig();

            var LoadTest = new LoadTest();
            LoadTest.Go(testSettings);
            Console.WriteLine("LoadTest complete");
        }
    }
}
