using System;
using System.Collections.Generic;
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

            using (_client = PowerBIClientFactory.CreatePowerBIClient(testSettings))
            {
                var group = _client.EnsureGroupSpace(testSettings).Result;

                UploadReports(group, allReports, testSettings);
            }

            Log.Info("Completed");
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
            var tasks = allReports.Select(report => Action(@group, report, testSettings));
            Task.WhenAll(tasks).Wait();
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

                    Log.Info($"UpdateConnections '{report.Key}'");
                    await UpdateConnections(importTestData, testSettings);

                    Log.Info($"Imported '{report.Key}'");

                    var token = await CreateToken(importTestData);
                    Log.Info($"Embedded Token created {token}");
                }
                catch (Exception exception)
                {
                    Log.Error($"Import Failed '{report.Key}'", exception);
                    _telemetryClient.TrackException(exception);
                }
            }

            _telemetryClient.Flush();
        }

        async Task<string> CreateToken(ImportTestData importTestData)
        {
            var token = await _client.GenerateToken(importTestData.GroupId, importTestData.Report.Id);
            return token;
        }

        async Task<ImportTestData> Import(string @groupId, byte[] bytes, string name, int testSettingsImportStatusAttempts, int testSettingsImportStatusDelaySeconds)
        {
            var datasetName = "ds_" + Guid.NewGuid();
            var importId = await _client.Import(@groupId, new MemoryStream(bytes), datasetName);

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
            using (_telemetryClient.StartOperation<RequestTelemetry>("SetAllDatasetConnections"))
            {
                await _client.SetConnections(
                    importTestData.GroupId,
                    importTestData.DatasetId,
                    testSettings.SqlConnectionString);
            }

            IEnumerable<DataSource> dataSourceBindings;
            using (_telemetryClient.StartOperation<RequestTelemetry>("GetGatewayDatasources"))
            {
                dataSourceBindings = await _client.GetDatasources(importTestData.GroupId, importTestData.DatasetId);
            }

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
