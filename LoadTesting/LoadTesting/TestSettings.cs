namespace LoadTesting
{
    public class TestSettings
    {
        public string ApiUrl { get; set; }
        public int HttpClientTimeoutSeconds { get; set; }
        public string CapacityName { get; set; }
        public string GroupNamePrefix { get; set; }
        public string PbiUsername { get; set; }
        public string PbiPassword { get; set; }
        public string SqlPassword { get; set; }
        public string SqlUsername { get; set; }
        public string SqlConnectionString { get; set; }
        public string ReportsRoot { get; set; }
        public int ImportStatusAttempts { get; set; }
        public int ImportStatusDelaySeconds { get; set; }
        public string AuthorityUrl { get; set; }
        public string ResourceUrl { get; set; }
        public string ClientId { get; set; }
        public int ConcurrentImportsLimit { get; set; }
        public string CollectionName { get; set; }
        public string CollectionKey { get; set; }
        public int ApiVersion { get; set; }
    }
}