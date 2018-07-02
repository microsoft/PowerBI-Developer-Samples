using System;
using System.Net.Http;
using System.Threading.Tasks;
using LoadTesting.Model;

namespace LoadTesting
{
    public class RenderTest
    {
        async Task TestEmbeddedUrl(ImportTestData importTestData, string token)
        {
            // TODO V1 and V2 are different.

            // a) call powerbi and get the cluster url from a javascript element
            // b) call the cluster metadata url to get the backendurl
            // c) modelsAndExploration
            var backendUrl = "https://wabi-north-europe-redirect.analysis.windows.net";
            var uri = new Uri($"{backendUrl}/explore/reports/{importTestData.Report.Id}/modelsAndExploration");

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", "EmbedToken " + token);
                client.DefaultRequestHeaders.TryAddWithoutValidation("X-PowerBI-User-GroupId", importTestData.GroupId);
                client.DefaultRequestHeaders.TryAddWithoutValidation("Referer", importTestData.Report.EmbedUrl);
                client.DefaultRequestHeaders.TryAddWithoutValidation("ActivityId", Guid.NewGuid().ToString());
                client.DefaultRequestHeaders.TryAddWithoutValidation("RequestId", Guid.NewGuid().ToString());
                var modelJson = await client.GetStringAsync(uri);
                //Json tests
                //call filters?
            }
        }
    }
}