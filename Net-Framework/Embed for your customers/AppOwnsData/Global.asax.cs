//----------------------------------------------------------------------------
// Copyright(c) Microsoft Corporation.
// Licensed under the MIT license.
//----------------------------------------------------------------------------

namespace AppOwnsData
{
    using System.Web.Routing;

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
    }
}
