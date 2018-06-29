using Microsoft.PowerBI.Api.V2.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace LoadTesting
{
    public class CredentialData
    {
        readonly BasicCredentials _basicCredentials;

        public CredentialData(BasicCredentials basicCredentials)
        {
            _basicCredentials = basicCredentials;
        }

        public string AsJson()
        {
            return JsonConvert.SerializeObject(new
            {
                CredentialData = new[]
                {
                    new
                    {
                        Value = _basicCredentials.Username,
                        Name = "username"
                    },
                    new
                    {
                        Value = _basicCredentials.Password,
                        Name = "password"
                    }
                }
            }, new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            });
        }
    }
}
