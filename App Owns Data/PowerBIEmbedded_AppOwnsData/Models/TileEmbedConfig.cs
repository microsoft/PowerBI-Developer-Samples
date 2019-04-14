using Microsoft.PowerBI.Api.V2.Models;
using System;

namespace PowerBIEmbedded_AppOwnsData.Models
{
    public class TileEmbedConfig : EmbedConfig
    {
        public Guid dashboardId { get; set; }
    }
}