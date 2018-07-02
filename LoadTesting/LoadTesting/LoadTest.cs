using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using log4net;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;

namespace LoadTesting
{
    public class LoadTest
    {
        static readonly ILog log = LogManager.GetLogger(typeof(LoadTest));

        const string Succeeded = "Succeeded";
        IPowerBIClientWrapper _client;
        TelemetryClient _telemetryClient;

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
                    { "ApiVersion", "2" }
                },
                new Dictionary<string, double>
                {
                    {"HttpClientTimeoutSeconds", testSettings.HttpClientTimeoutSeconds},
                    {"ReportCount", allReports.Count}
                });
            log.Info("Started");

            using (_client = CreatePowerBIClient(testSettings))
            {
                var group = _client.EnsureGroupSpace(testSettings).Result;

                UploadReports(group, allReports, testSettings);
            }

            log.Info("Completed");
            _telemetryClient.TrackEvent("Completed");
        }

        IPowerBIClientWrapper CreatePowerBIClient(TestSettings testSettings)
        {
            return testSettings.ApiVersion == 1
                ? PowerBIClientFactory.CreatePowerBIV1Client(testSettings)
                : PowerBIClientFactory.CreatePowerBIV2Client(testSettings);
        }

        Dictionary<string, byte[]> LoadAllReports(string path)
        {
            var bytes = new Dictionary<string, byte[]>();

            foreach (var file in Directory.EnumerateFiles(path))
            {
                bytes.Add(file, File.ReadAllBytes(file));
            }

            return bytes;
        }


        void UploadReports(string @group, Dictionary<string, byte[]> allReports, TestSettings testSettings)
        {
            var tasks = allReports.Select(report => Action(@group, report, testSettings));
            Task.WhenAll(tasks).Wait();
        }

        async Task Action(string @group, KeyValuePair<string, byte[]> report, TestSettings testSettings)
        {
            using (var operation = _telemetryClient.StartOperation<RequestTelemetry>("TotalImport"))
            {
                try
                {
                    operation.Telemetry.Metrics.Add("PBIXSize", report.Value.Length);
                    operation.Telemetry.Metrics.Add("PBIXName", report.Key.Length);

                    log.Info($"Importing '{report.Key}'");
                    var importData = await Import(@group, report.Value, report.Key, testSettings.ImportStatusAttempts, testSettings.ImportStatusDelaySeconds);
                    log.Info($"UpdateConnections '{report.Key}'");
                    await UpdateConnections(importData, testSettings);
                    log.Info($"Imported '{report.Key}'");
                    await TestEmbeddedUrl(importData);
                }
                catch (Exception exception)
                {
                    log.Error($"Import Failed '{report.Key}'", exception);
                    _telemetryClient.TrackException(exception);
                }
            }

            _telemetryClient.Flush();
        }

        async Task TestEmbeddedUrl(ImportData importData)
        {
            var token = await _client.GenerateToken(importData.GroupId, importData.Report.Id);

            // TODO Emulate a browser to load the report...
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.TryAddWithoutValidation("Token", token);
                await client.GetStringAsync(importData.Report.EmbedUrl);
                //log.Debug(html);
            }
        }

        async Task<ImportData> Import(string @groupId, byte[] bytes, string name, int testSettingsImportStatusAttempts, int testSettingsImportStatusDelaySeconds)
        {
            var datasetName = "ds_" + Guid.NewGuid();
            var importId = await _client.Import(@groupId, new MemoryStream(bytes), datasetName);

            var importResult = await PollImportState(groupId, importId, testSettingsImportStatusAttempts, testSettingsImportStatusDelaySeconds * 1000);
            if (importResult == null)
            {
                return null;
            }
            return new ImportData
            {
                GroupId = groupId,
                DatasetId = importResult.Datasets.Single().Id,
                Name = name,
                Report = importResult.Reports.Single()
            };
        }

        async Task<ImportResult> PollImportState(string @groupId, string importId, int count, int sleep)
        {
            for (var tries = 0; tries < count; tries++)
            {
                //using (_telemetryClient.StartOperation<RequestTelemetry>("GetImportById"))
                {
                    var result = await _client.GetImportById(@groupId, importId);
                    if (result.ImportState == Succeeded)
                    {
                        return result;
                    }
                }
                Thread.Sleep(sleep);
            }
            return null;
        }

        async Task UpdateConnections(ImportData importData, TestSettings testSettings)
        {
            //using (_telemetryClient.StartOperation<RequestTelemetry>("SetAllDatasetConnections"))
            {
                await _client.SetConnections(
                    importData.GroupId,
                    importData.DatasetId,
                    testSettings.SqlConnectionString);
            }

            IEnumerable<DataSource> dataSourceBindings;
            //using (_telemetryClient.StartOperation<RequestTelemetry>("GetGatewayDatasources"))
            {
                dataSourceBindings = await _client.GetDatasources(importData.GroupId, importData.DatasetId);
            }

            foreach (var binding in dataSourceBindings)
            {
                //using (_telemetryClient.StartOperation<RequestTelemetry>("UpdateDatasource"))
                {
                    await _client.UpdateDatasource(importData.GroupId, binding.GatewayId, binding.Id, testSettings.SqlUsername, testSettings.SqlPassword);
                }
            }
        }
    }
}
