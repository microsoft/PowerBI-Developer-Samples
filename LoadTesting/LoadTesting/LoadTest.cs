using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using log4net;
using log4net.Core;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Rest;

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

            using (_client = CreatePowerBIV1Client(testSettings))
            {
                var group = _client.EnsureGroupSpace(testSettings).Result;

                UploadReports(group, allReports, testSettings);
            }

            log.Info("Completed");
            _telemetryClient.TrackEvent("Completed");
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


        IPowerBIClientWrapper CreatePowerBIV2Client(TestSettings testSettings)
        {
            var tokenCredentials = GetTokenCredentials(testSettings).Result;

            var client = new PowerBIV2ClientWrapper(new Uri(testSettings.ApiUrl), tokenCredentials)
            {
                HttpClient =
                {
                    Timeout = TimeSpan.FromSeconds(testSettings.HttpClientTimeoutSeconds)
                },
            };
            return client;
        }

        IPowerBIClientWrapper CreatePowerBIV1Client(TestSettings testSettings)
        {
            var tokenCredentials = new TokenCredentials(testSettings.CollectionKey, "AppKey");

            var client = new PowerBIV1ClientWrapper(new Uri(testSettings.ApiUrl), tokenCredentials)
            {
                HttpClient =
                {
                    Timeout = TimeSpan.FromSeconds(testSettings.HttpClientTimeoutSeconds)
                },
                CollectionName = testSettings.CollectionName
            };
            return client;
        }

        static async Task<TokenCredentials> GetTokenCredentials(TestSettings testSettings)
        {
            var credential = new UserPasswordCredential(testSettings.PbiUsername, testSettings.PbiPassword);
            var authenticationContext = new AuthenticationContext(testSettings.AuthorityUrl);
            var authenticationResult = await authenticationContext.AcquireTokenAsync(testSettings.ResourceUrl, testSettings.ClientId, credential);
            var tokenCredentials = new TokenCredentials(authenticationResult.AccessToken);
            return tokenCredentials;
        }

        void UploadReports(string @group, Dictionary<string, byte[]> allReports, TestSettings testSettings)
        {
            var tasks = allReports.Select(report => Action(@group, report, testSettings));
            Task.WhenAll(tasks).Wait();
        }

        async Task Action(string @group, KeyValuePair<string, byte[]> report, TestSettings testSettings)
        {
            try
            {
                log.Info($"Importing '{report.Key}'");
                var importData = await Import(@group, report.Value, report.Key, testSettings.ImportStatusAttempts, testSettings.ImportStatusDelaySeconds);
                log.Info($"UpdateConnections '{report.Key}'");
                await UpdateConnections(importData, testSettings);
                log.Info($"Imported '{report.Key}'");
            }
            catch (Exception exception)
            {
                log.Error($"Import Failed '{report.Key}'", exception);
                _telemetryClient.TrackException(exception);
            }
        }

        async Task<ImportData> Import(string @groupId, byte[] bytes, string name, int testSettingsImportStatusAttempts, int testSettingsImportStatusDelaySeconds)
        {
            ImportResult import;
            using (var operation = _telemetryClient.StartOperation<RequestTelemetry>("PostImport"))
            {
                var datasetName = "ds_" + Guid.NewGuid();
                operation.Telemetry.Metrics.Add("PBIXSize", bytes.Length);
                operation.Telemetry.Properties.Add("DataSetId", datasetName);
                import = await _client.Import(@groupId, new MemoryStream(bytes), datasetName);
                _telemetryClient.StopOperation(operation);
            }

            using (var operation = _telemetryClient.StartOperation<RequestTelemetry>("PollImport"))
            {
                var importResult = await PollImportState(groupId, import.Id, testSettingsImportStatusAttempts, testSettingsImportStatusDelaySeconds * 1000);
                if (importResult == null)
                {
                    operation.Telemetry.Success = false;
                    return null;
                }
                return new ImportData
                {
                    GroupId = groupId,
                    DatasetId = importResult.Datasets.Single().Id,
                    Name = name
                };
            }
        }

        async Task<ImportResult> PollImportState(string @groupId, string importId, int count, int sleep)
        {
            for (var tries = 0; tries < count; tries++)
            {
                using (_telemetryClient.StartOperation<RequestTelemetry>("GetImportById"))
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
            using (_telemetryClient.StartOperation<RequestTelemetry>("SetAllDatasetConnections"))
            {
                await _client.SetConnections(
                    importData.GroupId,
                    importData.DatasetId,
                    testSettings.SqlConnectionString);
            }

            IEnumerable<DataSource> dataSourceBindings;
            using (_telemetryClient.StartOperation<RequestTelemetry>("GetGatewayDatasources"))
            {
                dataSourceBindings = await _client.GetDatasources(importData.GroupId, importData.DatasetId);
            }

            foreach (var binding in dataSourceBindings)
            {
                using (_telemetryClient.StartOperation<RequestTelemetry>("UpdateDatasource"))
                {
                    await _client.UpdateDatasource(importData.GroupId, binding.GatewayId, binding.Id, testSettings.SqlUsername, testSettings.SqlPassword);
                }
            }
        }
    }
}
