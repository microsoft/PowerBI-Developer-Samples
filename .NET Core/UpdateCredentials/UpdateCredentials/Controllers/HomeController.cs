// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UpdateCredentials.Controllers
{
	using UpdateCredentials.Models;
	using UpdateCredentials.Services;
	using Microsoft.AspNetCore.Mvc;
	using Microsoft.Extensions.Options;
	using System;

	public class HomeController : Controller
	{
		private readonly IOptions<AzureAd> azureAd;

		public HomeController(IOptions<AzureAd> azureAd)
		{
			this.azureAd = azureAd;
		}

		public IActionResult Index()
		{
			// Validate whether all the required configurations are provided in appsettings.json
			string configValidationResult = ConfigValidator.ValidateConfig(azureAd);
			if (configValidationResult != null)
			{
				Console.Error.WriteLine(configValidationResult);
				return BadRequest(configValidationResult);
			}
			return View();
		}
	}
}
