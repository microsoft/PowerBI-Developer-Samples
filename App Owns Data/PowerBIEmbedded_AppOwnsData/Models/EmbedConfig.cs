using Microsoft.PowerBI.Api.V2.Models;
using System;

namespace PowerBIEmbedded_AppOwnsData.Models
{
    public class EmbedConfig
    {
        public string Id { get; set; }

        public string EmbedUrl { get; set; }

        public EmbedToken EmbedToken { get; set; }

        public int MinutesToExpiration
        {
            get
            {
                var minutesToExpiration = EmbedToken.Expiration.Value - DateTime.UtcNow;
                return minutesToExpiration.Minutes;
            }
        }

        public string ErrorMessage { get; internal set; }
    }
}