// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace EncryptCredentials.Controllers
{
	using EncryptCredentials.Models;
	using EncryptCredentials.Services;
	using Microsoft.AspNetCore.Mvc;
	using Microsoft.Extensions.Options;
	using Microsoft.PowerBI.Api.Models;
	using Microsoft.Rest;
	using System;

	public class EncryptCredentialsController : Controller
	{
		private readonly PowerBIService powerBIService;
		private readonly IOptions<AzureAd> azureAd;

		public EncryptCredentialsController(PowerBIService powerBIService, IOptions<AzureAd> azureAd)
		{
			this.powerBIService = powerBIService;
			this.azureAd = azureAd;
		}

		/// <summary>
		/// Gets list of datasources for given Power BI Group Id and Dataset Id
		/// </summary>
		/// <param name="getDatasourceMap">Request body for Get Datasource API</param>
		/// <returns>Datasources present in corresponding Power BI Workspace</returns>
		[HttpGet("/encryptcredential/getdatasourcesingroup")]
		public IActionResult GetDatasourcesInGroup(GetDatasourceMap getDatasourceMap)
		{
			try
			{
				// Get gateway info
				var datasources = powerBIService.GetDatasourcesInGroup(getDatasourceMap.GroupId, getDatasourceMap.DatasetId);
				return Ok(datasources);
			}
			catch (HttpOperationException ex)
			{
				Console.Error.WriteLine(ex.Message + "\n\n" + ex.StackTrace);

				// Set status code of the response
				Response.StatusCode = (Int32)ex.Response.StatusCode;
				return Content("Error " + Response.StatusCode + " " + ex.Message);
			}
			catch (Exception ex)
			{
				Console.Error.WriteLine(ex.Message + "\n\n" + ex.StackTrace);
				return BadRequest(ex.Message);
			}
		}

		/// <summary>
		/// Updates Power BI gateway connection credentials
		/// </summary>
		/// <param name="updateDatasourceMap">Request body for Update Datasource API</param>
		/// <returns>Response message which is returned by Update Datasource API</returns>
		[HttpPost("/encryptcredential/updatedatasource")]
		public IActionResult UpdateDatasource(UpdateDatasourceMap updateDatasourceMap)
		{
			try
			{
				// Capture credential details
				var credentialDetails = powerBIService.GetCredentialDetails(updateDatasourceMap.GatewayId, updateDatasourceMap.CredentialType, updateDatasourceMap.Credentials, updateDatasourceMap.PrivacyLevel);

				// Create datasource request body for Updating the datasource
				var dataSourceRequest = new UpdateDatasourceRequest {
					CredentialDetails = credentialDetails
				};

				// Update gateway credentials
				powerBIService.UpdateDatasource(updateDatasourceMap.GatewayId, updateDatasourceMap.DatasourceId, dataSourceRequest);

				return Ok("Successfully updated data source credentials");
			}
			catch (HttpOperationException ex)
			{
				Console.Error.WriteLine(ex.Message + "\n\n" + ex.StackTrace);

				// Set status code of the response
				Response.StatusCode = (Int32)ex.Response.StatusCode;
				return Content("Error " + Response.StatusCode + " " + ex.Message);
			}
			catch (Exception ex)
			{
				Console.Error.WriteLine(ex.Message + "\n\n" + ex.StackTrace);
				return BadRequest(ex.Message);
			}
		}

		/// <summary>
		/// Add Datasource in Power BI Gateway
		/// </summary>
		/// <param name="addDatasourceMap">Request body for Add Datasource API</param>
		/// <returns>Response message which is returned by Add Datasource API</returns>
		[HttpPost("/encryptcredential/adddatasource")]
		public IActionResult AddDatasource(AddDatasourceMap addDatasourceMap)
		{
			try
			{
				// Check for cloud gateway
				var gateway = powerBIService.GetGateway(addDatasourceMap.GatewayId);

				// Name is null for cloud gateway
				if (string.IsNullOrWhiteSpace(gateway.Name))
				{
					var reason = "Add data source is not supported for cloud gateway.";
					return Content("Error: " + reason);
				}

				// Capture Credential Details
				var credentialDetails = powerBIService.GetCredentialDetails(addDatasourceMap.GatewayId, addDatasourceMap.CredentialType, addDatasourceMap.Credentials, addDatasourceMap.PrivacyLevel);

				// Capture Publish Datasource to Gateway Request
				var publishDatasourceToGatewayRequest = new PublishDatasourceToGatewayRequest(
					dataSourceType: addDatasourceMap.DatasourceType,
					connectionDetails: addDatasourceMap.ConnectionDetails,
					credentialDetails: credentialDetails,
					dataSourceName: addDatasourceMap.DatasourceName
				);

				// Add datasource in corresponding gateway
				var datasource = powerBIService.AddDatasource(addDatasourceMap.GatewayId, publishDatasourceToGatewayRequest);

				return Ok("Successfully added data source with ID: " + datasource.Id);
			}
			catch (HttpOperationException ex)
			{
				Console.Error.WriteLine(ex.Message + "\n\n" + ex.StackTrace);

				// Set status code of the response
				Response.StatusCode = (Int32)ex.Response.StatusCode;
				return Content("Error " + Response.StatusCode + " " + ex.Message);
			}
			catch (Exception ex)
			{
				Console.Error.WriteLine(ex.Message + "\n\n" + ex.StackTrace);
				return BadRequest(ex.Message);
			}
		}

		/// <summary>
		/// Encrypts the credentials provided by the user
		/// </summary>
		/// <param name="encrypytCredentialsMap">Request body for Encrypt Credentials API</param>
		/// <returns>Encrypted credentials</returns>
		[HttpPost("/encryptcredential/encrypt")]
		public IActionResult EncryptCredentials(EncryptCredentialsMap encryptCredentialsMap)
		{
			try
			{
				// Capture credential details
				var credentialDetails = powerBIService.GetCredentialDetails(encryptCredentialsMap.GatewayId, encryptCredentialsMap.CredentialType, encryptCredentialsMap.Credentials, encryptCredentialsMap.PrivacyLevel);

				return Ok(credentialDetails.Credentials);
			}
			catch (HttpOperationException ex)
			{
				Console.Error.WriteLine(ex.Message + "\n\n" + ex.StackTrace);

				// Set status code of the response
				Response.StatusCode = (Int32)ex.Response.StatusCode;
				return Content("Error " + Response.StatusCode + " " + ex.Message);
			}
			catch (Exception ex)
			{
				Console.Error.WriteLine(ex.Message + "\n\n" + ex.StackTrace);
				return BadRequest(ex.Message);
			}
		}
	}
}
