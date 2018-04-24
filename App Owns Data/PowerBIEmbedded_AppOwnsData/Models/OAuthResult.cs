using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace PowerBIEmbedded_AppOwnsData.Models
{
    public class OAuthResult
    {
        [JsonProperty("token_type")]
        public string TokenType { get; set; }
        [JsonProperty("scope")]
        public string Scope { get; set; }
        [JsonProperty("expires_in")]
        public int ExpiresIn { get; set; }
        [JsonProperty("expires_on")]
        public int ExpiresOn { get; set; }
        [JsonProperty("not_before")]
        public int NotBefore { get; set; }
        [JsonProperty("resource")]
        public string Resource { get; set; }
        [JsonProperty("access_token")]
        public string AccessToken { get; set; }
        [JsonProperty("id_token")]
        public string IdToken { get; set; }
        [JsonProperty("refresh_token")]
        public string RefreshToken { get; set; }
        [JsonProperty("status_code")]
        public Boolean StatusCode { get; set; }
        [JsonProperty("created_on")]
        public DateTime CreatedOn { get; set; }

    }
}