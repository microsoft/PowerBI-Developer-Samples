using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.PowerBI.Security;
using Microsoft.PowerBI.Api.V1;
using Microsoft.PowerBI.Api.V1.Models;
using Microsoft.Rest;

namespace LoadTesting
{
    class PowerBIV1ClientWrapper : PowerBIClient, IPowerBIClientWrapper
    {
        public string CollectionName { private get; set; }
        public string WorkspaceKey { private get; set; }

        public PowerBIV1ClientWrapper(Uri uri, ServiceClientCredentials tokenCredentials) : base(uri, tokenCredentials)
        {
        }

        public async Task<string> EnsureGroupSpace(TestSettings testSettings)
        {
            var groupName = testSettings.GroupNamePrefix;
            var existingWorkspaces = await Workspaces.GetWorkspacesByCollectionNameAsync(CollectionName);
            var existingWorkspace = existingWorkspaces.Value.FirstOrDefault();
            var workspace = existingWorkspace ?? await Workspaces.PostWorkspaceAsync(CollectionName, new CreateWorkspaceRequest(groupName));

            return workspace.WorkspaceId;
        }

        public async Task<string> Import(string groupId, MemoryStream memoryStream, string datasetName)
        {
            var result = await Imports.PostImportWithFileAsync(CollectionName, groupId, memoryStream, datasetName);
            return result.Id;
        }

        public async Task<ImportResult> GetImportById(string groupId, string importId)
        {
            var result = await Imports.GetImportByIdAsync(CollectionName, groupId, importId);
            return new ImportResult
            {
                Id = result.Id,
                ImportState = result.ImportState,
                Datasets = result.Datasets?.Select(x => new ImportDataset { Id = x.Id }),
                Reports = result.Reports?.Select(r => new ImportReport
                {
                    DataSetId = r.DatasetId,
                    Id = r.Id,
                    EmbedUrl = r.EmbedUrl
                })
            };
        }

        public async Task SetConnections(string importDataGroupId, string datasetKey, string connectionString)
        {
            var parameters = new Dictionary<string, object> { { "connectionString", connectionString } };
            await Datasets.SetAllConnectionsAsync(CollectionName, importDataGroupId, datasetKey, parameters);
        }

        public async Task<IEnumerable<DataSource>> GetDatasources(string workspaceId, string datasetId)
        {
            var v1 = await Datasets.GetGatewayDatasourcesAsync(CollectionName, workspaceId, datasetId);
            return v1.Value.Select(x => new DataSource
            {
                Id = x.Id,
                GatewayId = x.GatewayId
            });
        }

        public async Task UpdateDatasource(string workspaceId, string bindingGatewayId, string bindingId, string sqluser, string sqlPassword)
        {
            var datasource = new GatewayDatasource
            {
                CredentialType = "Basic",
                BasicCredentials = new BasicCredentials
                {
                    Username = sqluser,
                    Password = sqlPassword
                }
            };

            await Gateways.PatchDatasourceAsync(CollectionName, workspaceId, bindingGatewayId, bindingId, datasource);
        }

        public Task<string> GenerateToken(string workspaceId, string reportKey)
        {
            var embedToken = PowerBIToken.CreateReportEmbedToken(CollectionName, workspaceId, reportKey, "username");
            return Task.FromResult(embedToken.Generate(WorkspaceKey));
        }
    }
}