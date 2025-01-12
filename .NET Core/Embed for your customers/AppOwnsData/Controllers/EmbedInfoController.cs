// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace AppOwnsData.Controllers
{
    using AppOwnsData.Models;
    using AppOwnsData.Services;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;
    using System;
    using System.Text.Json;
    using Microsoft.Rest;
    using System.Linq;
    using System.Threading.Tasks;

    public class EmbedInfoController : Controller
    {
        private readonly PbiEmbedService pbiEmbedService;
        private readonly IOptions<AzureAd> azureAd;
        private readonly IOptions<PowerBI> powerBI;

        public EmbedInfoController(PbiEmbedService pbiEmbedService, IOptions<AzureAd> azureAd, IOptions<PowerBI> powerBI)
        {
            this.pbiEmbedService = pbiEmbedService;
            this.azureAd = azureAd;
            this.powerBI = powerBI;
        }

        /// <summary>
        /// Returns Embed token, Embed URL, and Embed token expiry to the client
        /// </summary>
        /// <returns>JSON containing parameters for embedding</returns>
        [HttpGet]
        public async Task<string> GetEmbedInfoAsync()
        {
            try
            {
                // Validate whether all the required configurations are provided in appsettings.json
                string configValidationResult = ConfigValidatorService.ValidateConfig(azureAd, powerBI);
                if (configValidationResult != null)
                {
                    HttpContext.Response.StatusCode = 400;
                    return configValidationResult;
                }

                EmbedParams embedParams = await pbiEmbedService.GetEmbedParams(new Guid(powerBI.Value.WorkspaceId), new Guid(powerBI.Value.ReportId));
                return JsonSerializer.Serialize<EmbedParams>(embedParams);
            }
            catch (HttpOperationException exc)
            {
                HttpContext.Response.StatusCode = (int)exc.Response.StatusCode;
                var message = string.Format("Status: {0} ({1})\r\nResponse: {2}\r\nRequestId: {3}", exc.Response.StatusCode, (int)exc.Response.StatusCode, exc.Response.Content, exc.Response.Headers["RequestId"].FirstOrDefault());
                return message;
            }
            catch (Exception ex)
            {
                HttpContext.Response.StatusCode = 500;
                return ex.Message + "\n\n" + ex.StackTrace;
            }
        }
    }
}
