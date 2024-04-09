// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Models
{
	using System.Net;

	public class ErrorModel
	{
		public HttpStatusCode ErrorCode { get; set; }
		public string ErrorMessage { get; set; }
	}
}
