// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Controllers
{
	using System.Net;
	using System.Web.Mvc;
	using UserOwnsData.Models;
	using UserOwnsData.Services;

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
				ErrorModel errorModel = Utils.GetErrorModel((HttpStatusCode)400, configValidationResult);
				return View("Error", errorModel);
			}
			return View();
		}
	}
}
