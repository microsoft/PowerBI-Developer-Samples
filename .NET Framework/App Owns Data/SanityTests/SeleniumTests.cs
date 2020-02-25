using System;
using System.IO;
using System.Reflection;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.IE;

namespace SanityTests
{
    /// <summary>
    /// Summary description for SeleniumTests
    /// </summary>
    [TestClass]
    public class SeleniumTests
    {
        private TestContext testContextInstance;
        private IWebDriver driver;
        private string appURL;

        public SeleniumTests()
        {
        }

        [TestMethod]
        [TestCategory("IE")]
        public void ReportTitleText()
        {
            driver.Navigate().GoToUrl(appURL + "/");
            var cont = driver.FindElement(By.Id("embedContainer"));

            Assert.IsNotNull(cont, "Report loaded");
        }

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return TestContextInstance;
            }
            set
            {
                TestContextInstance = value;
            }
        }

        public TestContext TestContextInstance { get => testContextInstance; set => testContextInstance = value; }

        [TestInitialize()]
        public void SetupTest()
        {
            appURL = (TestContext.Properties["webAppUrl"] ?? "http://localhost:42734") + "/Home/EmbedReport";

            string browser = "IE";
            switch (browser)
            {
                case "Chrome":
                    driver = new ChromeDriver(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location));
                    break;
                case "Firefox":
                    driver = new FirefoxDriver();
                    break;
                case "IE":
                    driver = new InternetExplorerDriver();
                    break;
                default:
                    driver = new ChromeDriver();
                    break;
            }
        }

        [TestCleanup()]
        public void SeleniumTestsCleanup()
        {
            driver.Quit();
        }
    }
}
