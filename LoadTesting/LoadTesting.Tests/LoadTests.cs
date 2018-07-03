using Xunit;

namespace LoadTesting.Tests
{
    public class LoadTests
    {
        [Fact]
        public void When_using_v1()
        {
            var load = new LoadTest();
            var settings = TestSettingsFactory.FromAppConfig();
            settings.ApiVersion = 1;
            settings.RunInParallel = true;
            load.Go(settings);
        }

        [Fact]
        public void When_using_v2()
        {
            var load = new LoadTest();
            var settings = TestSettingsFactory.FromAppConfig();
            settings.ApiVersion = 2;
            settings.RunInParallel = true;
            load.Go(settings);
        }
        [Fact]
        public void When_using_v1_sequential()
        {
            var load = new LoadTest();
            var settings = TestSettingsFactory.FromAppConfig();
            settings.ApiVersion = 1;
            settings.RunInParallel = false;
            load.Go(settings);
        }

        [Fact]
        public void When_using_v2_sequential()
        {
            var load = new LoadTest();
            var settings = TestSettingsFactory.FromAppConfig();
            settings.ApiVersion = 2;
            settings.RunInParallel = false;
            load.Go(settings);
        }
    }
}
