// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Services
{
	using System.Net;
	using UserOwnsData.Models;

	public class Utils
	{
		/// <summary>
		/// Creates error model
		/// </summary>
		/// <param name="errorCode">HTTP status code of the error</param>
		/// <param name="errorMessage">Error details</param>
		/// <returns>Object of ErrorModel containing error code and error message</returns>
		public static ErrorModel GetErrorModel(HttpStatusCode errorCode, string errorMessage) {
			ErrorModel errorModel = new ErrorModel
			{
				ErrorCode = errorCode,
				ErrorMessage = errorMessage
			};

			return errorModel;
		}
	}
}
