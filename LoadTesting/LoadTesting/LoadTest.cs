using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using Microsoft.Rest;

namespace LoadTesting
{
    public class LoadTest
    {
        const string Succeeded = "Succeeded";
        ConnectionDetails _connectionDetails;
        IPowerBIClient _client;
        UpdateDatasourceRequest _updateDatasourceRequest;
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

            CreateSqlCredentials(testSettings);

            using (_client = CreatePowerBIClient(testSettings))
            {
                var group = EnsureGroup(testSettings.GroupNamePrefix).Result;

                AssignCapacity(testSettings.CapacityName, @group).Wait();
                UploadReports(group, allReports, testSettings);
            }

            _telemetryClient.TrackEvent("Completed");
        }

        async Task<Group> EnsureGroup(string groupName)
        {
            var filter = $"name eq '{groupName}'";
            var group = _client.Groups.GetGroups(filter).Value.FirstOrDefault() ?? await _client.Groups.CreateGroupAsync(new GroupCreationRequest(groupName));
            return group;
        }

        async Task AssignCapacity(string name, Group @group)
        {
            if (!string.IsNullOrEmpty(name))
            {
                var capacities = await _client.Capacities.GetCapacitiesAsync();
                var capacityId = capacities.Value.Single(x => x.DisplayName == name).Id;
                await _client.Groups.AssignToCapacityAsync(@group.Id, new AssignToCapacityRequest(capacityId));
            }
        }

        void CreateSqlCredentials(TestSettings TestSettings)
        {
            _connectionDetails = new ConnectionDetails(TestSettings.SqlConnectionString);
            _updateDatasourceRequest = new UpdateDatasourceRequest
            {
                CredentialDetails = new CredentialDetails
                {
                    Credentials = new CredentialData(new BasicCredentials(TestSettings.SqlUsername, TestSettings.SqlPassword)).AsJson(),
                    CredentialType = "Basic",
                    EncryptedConnection = "Encrypted",
                    EncryptionAlgorithm = "None",
                    PrivacyLevel = "None"
                }
            };
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

        IPowerBIClient CreatePowerBIClient(TestSettings testSettings)
        {
            var tokenCredentials = GetTokenCredentials(testSettings).Result;

            var client = new PowerBIClient(new Uri(testSettings.ApiUrl), tokenCredentials);
            if (testSettings.HttpClientTimeoutSeconds > 0)
            {
                client.HttpClient.Timeout = TimeSpan.FromSeconds(testSettings.HttpClientTimeoutSeconds);
            }
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

        void UploadReports(Group @group, Dictionary<string, byte[]> allReports, TestSettings testSettings)
        {
            var tasks = allReports.Select(report => Action(@group, report, testSettings));
            Task.WhenAll(tasks).Wait();
        }

        async Task Action(Group @group, KeyValuePair<string, byte[]> report, TestSettings testSettings)
        {
            try
            {
                var importData = await Import(@group, report.Value, report.Key, testSettings.ImportStatusAttempts, testSettings.ImportStatusDelaySeconds);
                await UpdateConnections(importData);
            }
            catch (Exception exception)
            {
                _telemetryClient.TrackException(exception);
            }
        }

        async Task<ImportData> Import(Group group, byte[] bytes, string name, int testSettingsImportStatusAttempts, int testSettingsImportStatusDelaySeconds)
        {
            Import import;
            using (var operation = _telemetryClient.StartOperation<RequestTelemetry>("PostImport"))
            {
                var datasetName = "ds_" + Guid.NewGuid();
                operation.Telemetry.Metrics.Add("PBIXSize", bytes.Length);
                operation.Telemetry.Properties.Add("DataSetId", datasetName);
                import = await _client.Imports.PostImportWithFileAsyncInGroup(@group.Id, new MemoryStream(bytes), datasetName);
                _telemetryClient.StopOperation(operation);
            }

            using (var operation = _telemetryClient.StartOperation<RequestTelemetry>("PollImport"))
            {
                var importResult = await PollImportState(group, import, testSettingsImportStatusAttempts, testSettingsImportStatusDelaySeconds * 1000);
                if (importResult == null)
                {
                    operation.Telemetry.Success = false;
                    return null;
                }
                return new ImportData
                {
                    GroupId = group.Id,
                    DatasetId = importResult.Datasets[0].Id,
                    Name = name
                };
            }
        }

        async Task<Import> PollImportState(Group @group, Import import, int count, int sleep)
        {
            for (var tries = 0; tries < count; tries++)
            {
                using (_telemetryClient.StartOperation<RequestTelemetry>("GetImportById"))
                {
                    var result = await _client.Imports.GetImportByIdInGroupAsync(@group.Id, import.Id);
                    if (result.ImportState == Succeeded)
                    {
                        return result;
                    }
                }
                Thread.Sleep(sleep);
            }
            return null;
        }

        async Task UpdateConnections(ImportData importData)
        {
            using (_telemetryClient.StartOperation<RequestTelemetry>("SetAllDatasetConnections"))
            {
                await _client.Datasets.SetAllDatasetConnectionsInGroupAsync(
                    importData.GroupId,
                    importData.DatasetId,
                    _connectionDetails);
            }

            ODataResponseListGatewayDatasource dataSourceBindings;
            using (_telemetryClient.StartOperation<RequestTelemetry>("GetGatewayDatasources"))
            {
                dataSourceBindings = await _client.Datasets.GetGatewayDatasourcesInGroupAsync(importData.GroupId, importData.DatasetId);
            }

            foreach (var binding in dataSourceBindings.Value)
            {
                using (_telemetryClient.StartOperation<RequestTelemetry>("UpdateDatasource"))
                {
                    await _client.Gateways.UpdateDatasourceAsync(binding.GatewayId, binding.Id, _updateDatasourceRequest);
                }
            }
        }
    }
}
