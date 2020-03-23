using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(PowerBIEmbedded_AppOwnsData.Startup))]
namespace PowerBIEmbedded_AppOwnsData
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
