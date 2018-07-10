using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using log4net;
using LoadTesting.Model;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;

namespace LoadTesting
{
    public class LoadTest
    {
        static readonly ILog Log = LogManager.GetLogger(typeof(LoadTest));

        const string Succeeded = "Succeeded";
        IPowerBIClientWrapper _client;
        TelemetryClient _telemetryClient;
        string _template;

        public void Go(TestSettings testSettings)
        {
            var allReports = LoadAllReports(testSettings.ReportsRoot);
            _telemetryClient = new TelemetryClient();
            _telemetryClient.Context.User.Id = Environment.UserName;
            _telemetryClient.Context.Session.Id = DateTime.UtcNow.Ticks.ToString();
            _telemetryClient.Context.Device.OperatingSystem = Environment.OSVersion.ToString();

            _telemetryClient.TrackEvent("Started",
                new Dictionary<string, string>
                {
                    { "CapacityName", testSettings.CapacityName },
                    { "ApiVersion", testSettings.ApiVersion.ToString() }
                },
                new Dictionary<string, double>
                {
                    {"HttpClientTimeoutSeconds", testSettings.HttpClientTimeoutSeconds},
                    {"ReportCount", allReports.Count}
                });
            Log.Info("Started");
            var sw = Stopwatch.StartNew();

            _template = File.ReadAllText("Template.html");
            Directory.CreateDirectory("out");

            using (_client = PowerBIClientFactory.CreatePowerBIClient(testSettings))
            {
                var group = _client.EnsureGroupSpace(testSettings).Result;

                UploadReports(group, allReports, testSettings);
            }

            Log.Info($"Completed in {sw.Elapsed}");
            _telemetryClient.TrackEvent("Completed");
        }

        static Dictionary<string, byte[]> LoadAllReports(string path)
        {
            var bytes = new Dictionary<string, byte[]>();

            foreach (var file in Directory.EnumerateFiles(path))
            {
                bytes.Add(file, File.ReadAllBytes(file));
            }

            return bytes;
        }

        void UploadReports(string group, Dictionary<string, byte[]> allReports, TestSettings testSettings)
        {
            var tasks = allReports.Select(report => Action(group, report, testSettings));

            if (testSettings.RunInParallel)
            {
                Task.WhenAll(tasks).Wait();
            }
            else
            {
                foreach (var task in tasks)
                {
                    task.Wait();
                }
            }
        }

        async Task Action(string group, KeyValuePair<string, byte[]> report, TestSettings testSettings)
        {
            using (var operation = _telemetryClient.StartOperation<RequestTelemetry>("TotalImport"))
            {
                operation.Telemetry.Metrics.Add("PBIXSize", report.Value.Length);
                operation.Telemetry.Metrics.Add("PBIXName", report.Key.Length);
                try
                {
                    Log.Info($"Importing '{report.Key}'");
                    var importTestData = await Import(group, report.Value, report.Key, testSettings.ImportStatusAttempts, testSettings.ImportStatusDelaySeconds);

                    //await UpdateConnections(importTestData, testSettings);
                    Log.Info($"Imported '{report.Key}'");

                    //if (testSettings.CreateEmbedToken)
                    {
                        var token = await CreateEmbeddedToken(importTestData);
                        Log.Info($"Embedded {importTestData.Report.WebUrl} Token created");
                        Log.Debug($"Embed Token,{token}");
                        Log.Debug($"Embed URL,{importTestData.Report.EmbedUrl}");
                        Log.Debug($"Report ID,{importTestData.Report.Id}");

                        WriteHTml(importTestData, token);
                    }
                }
                catch (Exception exception)
                {
                    Log.Error($"Import Failed '{report.Key}'", exception);
                    _telemetryClient.TrackException(exception);
                }
            }

            _telemetryClient.Flush();
        }

        async void WriteHTml(ImportTestData importTestData, string token)
        {
            var output = _template
                .Replace("{reportId}", importTestData.Report.Id)
                .Replace("{embedUrl}", importTestData.Report.EmbedUrl)
                .Replace("{accessToken}", token)
                .Replace("{webUrl}", importTestData.Report.WebUrl)
                .Replace("{name}", importTestData.Name);
            using (var sw = new StreamWriter("out\\" + importTestData.Report.Id + ".html"))
            {
                await sw.WriteAsync(output);
            }
        }
        async Task<string> CreateEmbeddedToken(ImportTestData importTestData)
        {
            var token = await _client.GenerateToken(importTestData.GroupId, importTestData.Report.Id);
            return token;
        }

        async Task<ImportTestData> Import(string groupId, byte[] bytes, string name, int testSettingsImportStatusAttempts, int testSettingsImportStatusDelaySeconds)
        {
            var datasetName = "ds_" + Guid.NewGuid();
            var importId = await _client.Import(groupId, new MemoryStream(bytes), datasetName);

            var importResult = await PollImportState(groupId, importId, testSettingsImportStatusAttempts, testSettingsImportStatusDelaySeconds * 1000);
            if (importResult == null)
            {
                return null;
            }
            return new ImportTestData
            {
                GroupId = groupId,
                DatasetId = importResult.Datasets.Single().Id,
                Name = name,
                Report = importResult.Reports.Single()
            };
        }

        async Task<ImportResult> PollImportState(string groupId, string importId, int count, int sleep)
        {
            for (var tries = 0; tries < count; tries++)
            {
                using (_telemetryClient.StartOperation<RequestTelemetry>("GetImportById"))
                {
                    var result = await _client.GetImportById(groupId, importId);
                    if (result.ImportState == Succeeded)
                    {
                        return result;
                    }
                }
                Thread.Sleep(sleep);
            }
            return null;
        }

        async Task UpdateConnections(ImportTestData importTestData, TestSettings testSettings)
        {
            if (!string.IsNullOrEmpty(testSettings.SqlConnectionString))
            {
                Log.Info($"SetAllDatasetConnections '{importTestData.Report.Id}'");
                using (_telemetryClient.StartOperation<RequestTelemetry>("SetAllDatasetConnections"))
                {
                    await _client.SetConnections(
                        importTestData.GroupId,
                        importTestData.DatasetId,
                        testSettings.SqlConnectionString);
                }
            }

            if (!string.IsNullOrEmpty(testSettings.SqlUsername))
            {
                IEnumerable<DataSource> dataSourceBindings;
                using (_telemetryClient.StartOperation<RequestTelemetry>("GetGatewayDatasources"))
                {
                    dataSourceBindings = await _client.GetDatasources(importTestData.GroupId, importTestData.DatasetId);
                }
                Log.Info($"UpdateDatasource '{importTestData.Report.Id}'");
                foreach (var binding in dataSourceBindings)
                {
                    using (_telemetryClient.StartOperation<RequestTelemetry>("UpdateDatasource"))
                    {
                        await _client.UpdateDatasource(importTestData.GroupId, binding.GatewayId, binding.Id, testSettings.SqlUsername, testSettings.SqlPassword);
                    }
                }
            }
        }
    }
}
