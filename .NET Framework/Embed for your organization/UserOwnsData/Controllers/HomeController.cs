// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Controllers
{
	using UserOwnsData.Models;
	using UserOwnsData.Services;
	using UserOwnsData.Services.Security;
	using System;
	using System.Net;
	using System.Web.Mvc;

	public class HomeController : Controller
	{
		/// <summary>
		/// Returns Index view to the client after validating app configurations
		/// </summary>
		/// <returns>Returns Index view</returns>
		public ActionResult Index()
		{
			// Validate sanctity of configuration before proceeding
			string configValidationResult = ConfigValidatorService.ValidateConfig();
			if (configValidationResult != null)
			{
				ErrorModel errorModel = new ErrorModel
				{
					ErrorCode = (HttpStatusCode)400,
					ErrorMessage = configValidationResult
				};
				return View("Error", errorModel);
			}
			return View();
		}
	}
}
