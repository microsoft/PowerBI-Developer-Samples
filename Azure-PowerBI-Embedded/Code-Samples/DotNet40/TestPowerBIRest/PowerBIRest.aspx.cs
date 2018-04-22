using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace TestPowerBIRest
{
    public partial class PowerBIRest : System.Web.UI.Page
    {
        string workspaceCollection = "XXXXXXXXXXXXX"; //Add Workspacecollection
        string workspaceId = "XXXXXXXXXXXXXXXXXX"; //Add WorkspaceID
        string accessKey = "XXXXXXXXXXXX";//Add AccessKey
        string apiUrl = "https://api.powerbi.com";
        string reportId = "XXXXXXXXXX"; //Add reportID
        string resourceid = "https://analysis.windows.net/powerbi/api";
        static readonly char[] padding = { '=' };

        protected void Page_Load(object sender, EventArgs e)
        {
            string uri = "https://api.powerbi.com/v1.0/";
            WebRequest request = WebRequest.Create(uri + "collections/" + workspaceCollection + "/workspaces/" + workspaceId + "/reports");
            // If required by the server, set the credentials.
            //request.Credentials =  CredentialCache.DefaultCredentials;

            request.Headers.Add("Authorization", "AppKey " + accessKey);
            // Get the response.
            WebResponse response = request.GetResponse();
            // Display the status.
            Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            // Get the stream containing content returned by the server.
            Stream dataStream = response.GetResponseStream();
            // Open the stream using a StreamReader for easy access.
            StreamReader reader = new StreamReader(dataStream);
            // Read the content.
            string responseFromServer = reader.ReadToEnd();

            string[] Data = responseFromServer.Split('"');

            string EmbeddUrl = Data[21];
            //string[] d2 = EmbeddUrl.Split(',');

            int unixTimestamp = (int)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds + 1 * 60 * 60;
           
            String pbieKey1 = "{\"typ\":\"JWT\",\"alg\":\"HS256\"}";
            String pbieKey2 = "{\"wid\":\""+workspaceId+"\",\"rid\":\""+ reportId+"\",\"wcn\":\""+ workspaceCollection+"\",\"iss\":\"PowerBISDK\",\"ver\":\"0.2.0\"," +
                    "\"aud\":\""+ resourceid+"\",\"exp\":"+ unixTimestamp+"}";
            String pbieKey1n2ToBase64 = Convert.ToBase64String(System.Text.ASCIIEncoding.ASCII.GetBytes(pbieKey1)).TrimEnd(padding).Replace('+', '-').Replace('/', '_') + "." + Convert.ToBase64String(System.Text.ASCIIEncoding.ASCII.GetBytes(pbieKey2)).TrimEnd(padding).Replace('+', '-').Replace('/', '_');
            String pbieKey3 = HMAC256EncryptBase64UrlEncode(pbieKey1n2ToBase64, accessKey);
            String access_token = pbieKey1n2ToBase64 + "." + pbieKey3;
            accessTokenText.Value = access_token;
            embedUrlText.Value = EmbeddUrl;
            // Display the content.
            Console.WriteLine(responseFromServer);
            // Clean up the streams and the response.
            reader.Close();
            response.Close();
        }
        private String HMAC256EncryptBase64UrlEncode(String str, String accessKey)
        {
            byte[]
            key = Encoding.UTF8.GetBytes(accessKey);
            byte[]
            strBytes = Encoding.UTF8.GetBytes(str);
            HMACSHA256 hmac = new HMACSHA256(key);
            hmac.Initialize();
            byte[] rawHmac = hmac.ComputeHash(strBytes);
            string b64Str = Convert.ToBase64String(rawHmac);
            return b64Str.TrimEnd(padding).Replace('/', '_').Replace('+', '-').Replace("[", "").Replace("=", "").Replace("]", "");
        }

    }


}