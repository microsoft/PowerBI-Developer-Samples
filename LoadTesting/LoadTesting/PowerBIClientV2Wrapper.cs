using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using LoadTesting.Model;
using Microsoft.PowerBI.Api.V2;
using Microsoft.PowerBI.Api.V2.Models;
using Microsoft.Rest;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace LoadTesting
{
    class PowerBIClientV2Wrapper : PowerBIClient, IPowerBIClientWrapper
    {
        public PowerBIClientV2Wrapper(Uri uri, ServiceClientCredentials tokenCredentials)
            : base(uri, tokenCredentials)
        {
        }

        public async Task<string> EnsureGroupSpace(TestSettings testSettings)
        {
            var groupName = testSettings.GroupNamePrefix;
            var filter = $"name eq '{groupName}'";
            var existingGroups = await Groups.GetGroupsAsync(filter);
            var existingGroup = existingGroups.Value.FirstOrDefault();

            var group = existingGroup ?? await Groups.CreateGroupAsync(new GroupCreationRequest(groupName));

            await AssignCapacity(testSettings.CapacityName, group);
            return group.Id;
        }

        async Task AssignCapacity(string name, Group group)
        {
            if (string.IsNullOrEmpty(name))
            {

                await Groups.AssignToCapacityAsync(group.Id, new AssignToCapacityRequest(Guid.Empty.ToString()));
            }
            else
            {
                var capacities = await Capacities.GetCapacitiesAsync();
                var capacityId = capacities.Value.Single(x => x.DisplayName == name).Id;
                await Groups.AssignToCapacityAsync(group.Id, new AssignToCapacityRequest(capacityId));
            }
        }

        public async Task<string> Import(string groupId, MemoryStream memoryStream, string datasetName)
        {
            var result = await Imports.PostImportWithFileAsyncInGroup(groupId, memoryStream, datasetName);
            return result.Id;
        }

        public async Task<ImportResult> GetImportById(string groupId, string importId)
        {
            var result = await Imports.GetImportByIdInGroupAsync(groupId, importId);
            return new ImportResult
            {
                Id = result.Id,
                ImportState = result.ImportState,
                Datasets = result.Datasets?.Select(x => new ImportDataset
                {
                    Id = x.Id
                }),
                Reports = result.Reports?.Select(r => new ImportReport
                {
                    Id = r.Id,
                    DataSetId = r.DatasetId,
                    EmbedUrl = r.EmbedUrl
                })
            };
        }

        public async Task SetConnections(string groupSpace, string datasetKey, string connectionString)
        {
            await Datasets.SetAllDatasetConnectionsInGroupAsync(groupSpace, datasetKey, new ConnectionDetails(connectionString));
        }

        public async Task<IEnumerable<DataSource>> GetDatasources(string groupSpace, string datasetKey)
        {
            var list = await Datasets.GetGatewayDatasourcesInGroupAsync(groupSpace, datasetKey);
            return list.Value.Select(x => new DataSource
            {
                Id = x.Id,
                GatewayId = x.GatewayId
            });
        }

        public async Task UpdateDatasource(string workspaceId, string bindingGatewayId, string bindingId, string sqluser, string sqlPassword)
        {
            var updateDatasourceRequest = new UpdateDatasourceRequest
            {
                CredentialDetails = new CredentialDetails
                {
                    Credentials = CredentialsJson(sqluser, sqlPassword),
                    CredentialType = "Basic",
                    EncryptedConnection = "Encrypted",
                    EncryptionAlgorithm = "None",
                    PrivacyLevel = "None"
                }
            };
            await Gateways.UpdateDatasourceAsync(bindingGatewayId, bindingId, updateDatasourceRequest);
        }

        public async Task<string> GenerateToken(string groupId, string reportKey)
        {
            var result = await Reports.GenerateTokenInGroupAsync(groupId, reportKey, new GenerateTokenRequest("view"));
            return result.Token;
        }

        static string CredentialsJson(string username, string password)
        {
            return JsonConvert.SerializeObject(new
            {
                CredentialData = new[]
                {
                        new
                        {
                            Value = username,
                            Name = "username"
                        },
                        new
                        {
                            Value = password,
                            Name = "password"
                        }
                    }
            }, new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });
        }
    }
}