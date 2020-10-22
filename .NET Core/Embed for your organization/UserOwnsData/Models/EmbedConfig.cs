// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Models
{
    using System.Text.Json.Serialization;

    public class EmbedConfig
    {
        [JsonPropertyName("accessToken")]
        public string AccessToken { get; set; }

        [JsonPropertyName("embedUrl")]
        public string EmbedUrl { get; set; }

        public EmbedConfig(string accessToken, string embedUrl)
        {
            this.AccessToken = accessToken;
            this.EmbedUrl = embedUrl;
        }
    }
}
