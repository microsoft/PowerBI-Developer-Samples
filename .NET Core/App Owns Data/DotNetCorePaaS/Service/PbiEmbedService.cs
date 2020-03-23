namespace DotNetCorePaaS.Service
{
    using DotNetCorePaaS.Models;
    using Microsoft.Extensions.Options;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;

    public class PbiEmbedService
    {
        /// <summary>
        /// Returns Embed token, Embed URL, and Embed token expiration
        /// </summary>
        /// <param name="accessToken">Access token to generate Embed token</param>
        /// <param name="appSettings">Contains appsettings.json configuration values</param>
        /// <returns>Returns REST API response JSON</returns>
        public static string GetEmbedParam(string accessToken, IOptions<ConfigurationModel> appSettings)
        {
            try
            {
                JObject apiResponse = GetEmbedUrl(appSettings.Value.WorkspaceId, appSettings.Value.ReportId, accessToken);
                string embedUrl = apiResponse.GetValue("embedUrl").ToString();
                string datasetId = apiResponse.GetValue("datasetId").ToString();

                apiResponse = GetEmbedToken(datasetId, appSettings.Value.ReportId, accessToken);

                // Get embed token
                string embedToken = apiResponse.GetValue("token").ToString();
                
                // Get embed token expiration
                string embedTokenExpiry = apiResponse.GetValue("expiration").ToString();
                
                return "{\"embedUrl\":\"" + embedUrl + "\", \"accessToken\":\"" + embedToken + "\", \"embedTokenExpiry\":\"" + embedTokenExpiry + "\"}";
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Generates and returns Embed Url and dataset Id for the report
        /// </summary>
        /// <param name="workspaceId">Workspace Id in which the report resides</param>
        /// <param name="reportId">Report Id</param>
        /// <param name="accessToken">Access token to generate Embed token</param>
        /// <returns>Returns REST API response JSON</returns>
        private static JObject GetEmbedUrl(string workspaceId, string reportId, string accessToken)
        {
            HttpClient embedTokenClient = new HttpClient();
            embedTokenClient.DefaultRequestHeaders.Accept.Clear();
            embedTokenClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            embedTokenClient.DefaultRequestHeaders.Authorization = (new AuthenticationHeaderValue("Bearer", accessToken));

            try
            {
                string reportEndpoint = $"https://api.powerbi.com/v1.0/myorg/groups/{workspaceId}/reports/{reportId}";
                HttpResponseMessage embedUrlApiResponse = embedTokenClient.GetAsync(reportEndpoint).Result;
                if (embedUrlApiResponse.StatusCode != HttpStatusCode.OK)
                {
                    string requestId = GetRequestId(embedUrlApiResponse.Headers.GetValues("requestId"));
                    throw new Exception($"Reason: {embedUrlApiResponse.ReasonPhrase}\nRequestId: {requestId}");
                }
                string responseContent = embedUrlApiResponse.Content.ReadAsStringAsync().Result;
                JObject embedResponse = JsonConvert.DeserializeObject(responseContent) as JObject;
                return embedResponse;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Generates and returns Embed token and Embed token expiration
        /// </summary>
        /// <param name="datasetId">Dataset Id of report to be embedded</param>
        /// <param name="reportId">Report Id</param>
        /// <param name="accessToken">Access token to generate Embed token</param>
        /// <returns>Returns REST API response JSON</returns>
        private static JObject GetEmbedToken(string datasetId, string reportId, string accessToken)
        {
            HttpClient embedTokenClient = new HttpClient();
            embedTokenClient.DefaultRequestHeaders.Accept.Clear();
            embedTokenClient.DefaultRequestHeaders.Authorization = (new AuthenticationHeaderValue("Bearer", accessToken));
            
            try
            {
                string tokenEndpoint = "https://api.powerbi.com/v1.0/myorg/GenerateToken";
                string requestBody = "{\"datasets\":[{\"id\":\"" + datasetId + "\"}],\"reports\":[{\"id\":\"" + reportId + "\"}]}";
                StringContent content = new StringContent(requestBody, Encoding.UTF8, "application/json");
                
                // Generate Embed token for multiple workspaces, datasets, and reports. Refer https://aka.ms/MultiResourceEmbedToken
                HttpResponseMessage embedTokenApiResponse = embedTokenClient.PostAsync(tokenEndpoint, content).Result;
                if (embedTokenApiResponse.StatusCode != HttpStatusCode.OK)
                {
                    string requestId = GetRequestId(embedTokenApiResponse.Headers.GetValues("requestId"));
                    throw new Exception($"Reason: {embedTokenApiResponse.ReasonPhrase}\nRequestId: {requestId}");
                }
                string responseContent = embedTokenApiResponse.Content.ReadAsStringAsync().Result;
                JObject embedResponse = JsonConvert.DeserializeObject(responseContent) as JObject;
                return embedResponse;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Returns request Id of the Power BI API request
        /// </summary>
        /// <param name="headerParam">Enumerable object of HTTP response header</param>
        /// <returns>Id of Power BI API request</returns>
        private static string GetRequestId(IEnumerable<string> headerParam)
        {
            try
            {
                // Return empty string if headerParam is empty otherwise, return request Id
                string requestId = headerParam.DefaultIfEmpty(string.Empty).First();
                return requestId;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
