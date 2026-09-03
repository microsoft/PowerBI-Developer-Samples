// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace EncryptCredentials.Tests
{
    using EncryptCredentials.Models;
    using EncryptCredentials.Services;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Mvc.Testing;
    using Microsoft.AspNetCore.TestHost;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.DependencyInjection.Extensions;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using Microsoft.PowerBI.Api.Models;
    using Microsoft.PowerBI.Api.Models.Credentials;
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Security.Claims;
    using System.Text.Encodings.Web;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using Xunit;

    public class AuthorizationTests : IClassFixture<DatasourceWebApplicationFactory>
    {
        private readonly DatasourceWebApplicationFactory factory;

        public AuthorizationTests(DatasourceWebApplicationFactory factory)
        {
            this.factory = factory;
        }

        public static IEnumerable<object[]> PrivilegedEndpoints()
        {
            yield return new object[] { HttpMethod.Get, "/encryptcredential/getdatasourcesingroup" };
            yield return new object[] { HttpMethod.Post, "/encryptcredential/updatedatasource" };
            yield return new object[] { HttpMethod.Post, "/encryptcredential/adddatasource" };
            yield return new object[] { HttpMethod.Post, "/encryptcredential/encrypt" };
        }

        [Theory]
        [MemberData(nameof(PrivilegedEndpoints))]
        public async Task AnonymousRequestsAreRejected(HttpMethod method, string path)
        {
            using var request = new HttpRequestMessage(method, path);
            using var response = await factory.CreateClient().SendAsync(request);

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task UserWithoutDatasourceAdministratorRoleIsForbidden()
        {
            using var request = new HttpRequestMessage(HttpMethod.Get, "/encryptcredential/getdatasourcesingroup");
            request.Headers.Authorization = new AuthenticationHeaderValue("Test", "user");

            using var response = await factory.CreateClient().SendAsync(request);

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }

        [Fact]
        public async Task AnonymousApiChallengeDoesNotContactIdentityProvider()
        {
            using var identityProviderUnavailableFactory = new UnavailableIdentityProviderFactory();
            using var client = identityProviderUnavailableFactory.CreateClient(
                new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

            using var response = await client.GetAsync("/encryptcredential/getdatasourcesingroup");

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task AdministratorPostWithoutAntiforgeryTokenIsRejected()
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, "/encryptcredential/adddatasource");
            request.Headers.Authorization = new AuthenticationHeaderValue("Test", Startup.DatasourceAdministratorRole);
            request.Content = new FormUrlEncodedContent(new Dictionary<string, string>());

            using var response = await factory.CreateClient().SendAsync(request);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Theory]
        [MemberData(nameof(PrivilegedEndpoints))]
        public async Task AdministratorCanAccessPrivilegedEndpoints(HttpMethod method, string path)
        {
            using var client = factory.CreateClient();
            using var homeRequest = CreateAdministratorRequest(HttpMethod.Get, "/");
            using var homeResponse = await client.SendAsync(homeRequest);
            var home = await homeResponse.Content.ReadAsStringAsync();
            var antiforgeryToken = Regex.Match(
                home,
                "name=\"__RequestVerificationToken\" type=\"hidden\" value=\"([^\"]+)\"")
                .Groups[1]
                .Value;

            Assert.True(
                homeResponse.IsSuccessStatusCode,
                $"Expected the home page to succeed but received {homeResponse.StatusCode}: {home}");
            Assert.NotEmpty(antiforgeryToken);

            using var request = CreateAdministratorRequest(method, GetSuccessfulRequestPath(path));
            request.Headers.Add("RequestVerificationToken", antiforgeryToken);
            if (method == HttpMethod.Post)
            {
                request.Content = CreateSuccessfulRequestContent(path);
            }

            using var response = await client.SendAsync(request);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        private static HttpRequestMessage CreateAdministratorRequest(HttpMethod method, string path)
        {
            var request = new HttpRequestMessage(method, path);
            request.Headers.Authorization = new AuthenticationHeaderValue(
                TestAuthenticationHandler.SchemeName,
                Startup.DatasourceAdministratorRole);
            return request;
        }

        private static string GetSuccessfulRequestPath(string path)
        {
            if (path.EndsWith("getdatasourcesingroup", StringComparison.Ordinal))
            {
                return path + "?GroupId=00000000-0000-0000-0000-000000000001"
                    + "&DatasetId=00000000-0000-0000-0000-000000000002";
            }

            return path;
        }

        private static FormUrlEncodedContent CreateSuccessfulRequestContent(string path)
        {
            var values = new Dictionary<string, string>
            {
                ["GatewayId"] = "00000000-0000-0000-0000-000000000003",
                ["CredentialType"] = Constants.KeyCredentials,
                ["Credentials"] = "test-key",
                ["PrivacyLevel"] = "None"
            };

            if (path.EndsWith("updatedatasource", StringComparison.Ordinal))
            {
                values["DatasourceId"] = "00000000-0000-0000-0000-000000000004";
            }
            else if (path.EndsWith("adddatasource", StringComparison.Ordinal))
            {
                values["DatasourceType"] = "Sql";
                values["DatasourceName"] = "Test datasource";
                values["ConnectionDetails"] = "{\"server\":\"test\",\"database\":\"test\"}";
            }

            return new FormUrlEncodedContent(values);
        }
    }

    public class UnavailableIdentityProviderFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((context, configuration) =>
            {
                configuration.AddInMemoryCollection(new Dictionary<string, string>
                {
                    ["OperatorAzureAd:Instance"] = "https://127.0.0.1:1/",
                    ["OperatorAzureAd:TenantId"] = "00000000-0000-0000-0000-000000000000",
                    ["OperatorAzureAd:ClientId"] = "00000000-0000-0000-0000-000000000000",
                    ["OperatorAzureAd:ClientSecret"] = "test-secret",
                    ["OperatorAzureAd:CallbackPath"] = "/signin-oidc"
                });
            });
        }
    }

    public class DatasourceWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((context, configuration) =>
            {
                configuration.AddInMemoryCollection(new Dictionary<string, string>
                {
                    ["OperatorAzureAd:Instance"] = "https://login.microsoftonline.com/",
                    ["OperatorAzureAd:TenantId"] = "00000000-0000-0000-0000-000000000000",
                    ["OperatorAzureAd:ClientId"] = "00000000-0000-0000-0000-000000000000",
                    ["OperatorAzureAd:ClientSecret"] = "test-secret",
                    ["OperatorAzureAd:CallbackPath"] = "/signin-oidc",
                    ["AzureAd:AuthenticationMode"] = Constants.ServicePrincipal,
                    ["AzureAd:AuthorityUrl"] = "https://login.microsoftonline.com/organizations/",
                    ["AzureAd:ClientId"] = "00000000-0000-0000-0000-000000000000",
                    ["AzureAd:TenantId"] = "00000000-0000-0000-0000-000000000000",
                    ["AzureAd:PowerBiApiUrl"] = "https://api.powerbi.com/",
                    ["AzureAd:ScopeBase:0"] = "https://analysis.windows.net/powerbi/api/.default",
                    ["AzureAd:ClientSecret"] = "test-secret"
                });
            });

            builder.ConfigureTestServices(services =>
            {
                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = TestAuthenticationHandler.SchemeName;
                    options.DefaultChallengeScheme = TestAuthenticationHandler.SchemeName;
                    options.DefaultForbidScheme = TestAuthenticationHandler.SchemeName;
                    options.DefaultScheme = TestAuthenticationHandler.SchemeName;
                }).AddScheme<AuthenticationSchemeOptions, TestAuthenticationHandler>(
                    TestAuthenticationHandler.SchemeName,
                    options => { });

                services.RemoveAll<PowerBIService>();
                services.AddScoped<PowerBIService, TestPowerBIService>();
            });
        }
    }

    public class TestPowerBIService : PowerBIService
    {
        public TestPowerBIService()
            : base(null)
        {
        }

        public override Datasources GetDatasourcesInGroup(Guid groupId, Guid datasetId)
        {
            return new Datasources();
        }

        public override Gateway GetGateway(Guid gatewayId)
        {
            return new Gateway(gatewayId) { Name = "Test gateway" };
        }

        public override CredentialDetails GetCredentialDetails(
            Guid gatewayId,
            string credentialType,
            string[] credentialsArray,
            string privacyLevel)
        {
            return new CredentialDetails(
                new KeyCredentials("test-key"),
                privacyLevel,
                EncryptedConnection.NotEncrypted);
        }

        public override void UpdateDatasource(
            Guid gatewayId,
            Guid datasourceId,
            UpdateDatasourceRequest dataSourceRequest)
        {
        }

        public override GatewayDatasource AddDatasource(
            Guid gatewayId,
            PublishDatasourceToGatewayRequest publishDatasourceToGatewayRequest)
        {
            return new GatewayDatasource();
        }
    }

    public class TestAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public const string SchemeName = "Test";

        public TestAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder)
            : base(options, logger, encoder)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.TryGetValue("Authorization", out var authorization))
            {
                return Task.FromResult(AuthenticateResult.NoResult());
            }

            var role = AuthenticationHeaderValue.Parse(authorization).Parameter;
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "test-user"),
                new Claim(ClaimTypes.Name, "Test User")
            };

            if (!string.IsNullOrWhiteSpace(role))
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var principal = new ClaimsPrincipal(new ClaimsIdentity(claims, SchemeName));
            var ticket = new AuthenticationTicket(principal, SchemeName);
            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}
