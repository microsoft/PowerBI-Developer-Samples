// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData
{
	using UserOwnsData.Services.Security;
	using Owin;
	using System.Web.Mvc;
	using System.Web.Routing;

	public class Startup
	{
		public void Configuration(IAppBuilder app)
		{

			// init ASP.NET MVC routes
			AreaRegistration.RegisterAllAreas();
			RouteConfig.RegisterRoutes(RouteTable.Routes);

			// init OpenId Connect settings
			OwinOpenIdConnect.ConfigureAuth(app);
		}
	}
}