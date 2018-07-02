using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using LoadTesting.Model;

namespace LoadTesting
{
    public interface IPowerBIClientWrapper : IDisposable
    {
        Task<string> EnsureGroupSpace(TestSettings testSettings);

        Task<string> Import(string groupId, MemoryStream memoryStream, string datasetName);
        Task<ImportResult> GetImportById(string groupId, string importId);

        Task SetConnections(string groupSpace, string datasetKey, string connectionString);

        Task<IEnumerable<DataSource>> GetDatasources(string groupId, string datasetId);
        Task UpdateDatasource(string groupId, string gatewayId, string bindingId, string sqlUsername, string sqlPassword);

        Task<string> GenerateToken(string groupId, string reportKey);
    }
}