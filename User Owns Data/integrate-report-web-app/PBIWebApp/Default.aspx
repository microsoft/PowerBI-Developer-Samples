<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="PBIWebApp._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <script src="https://npmcdn.com/es6-promise@3.2.1"></script>
    <script type="text/javascript" src="scripts/powerbi.js"></script>

    <script type="text/javascript">

        //This code is for sample purposes only.

        //Configure IFrame for the Report after you have an Access Token. See Default.aspx.cs to learn how to get an Access Token
        window.onload = function () {
            var accessToken = document.getElementById('MainContent_accessToken').value;

            if (!accessToken || accessToken == "")
            {
                return;
            }

            var embedUrl = document.getElementById('MainContent_txtEmbedUrl').value;
            var reportId = document.getElementById('MainContent_txtReportId').value;

            // Embed configuration used to describe the what and how to embed.
            // This object is used when calling powerbi.embed.
            // This also includes settings and options such as filters.
            // You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
            var config = {
                type: 'report',
                accessToken: accessToken,
                embedUrl: embedUrl,
                id: reportId,
                settings: {
                    filterPaneEnabled: true,
                    navContentPaneEnabled: true
                }
            };

            // Grab the reference to the div HTML element that will host the report.
            var reportContainer = document.getElementById('reportContainer');

            // Embed the report and display it within the div container.
            var report = powerbi.embed(reportContainer, config);

            // Report.on will add an event handler which prints to Log window.
            report.on("loaded", function () {
                var logView = document.getElementById('logView');
                logView.innerHTML = logView.innerHTML + "Loaded<br/>";

                // Report.off removes a given event handler if it exists.
                report.off("loaded");
            });

            // Report.on will add an event handler which prints to Log window.
            report.on("rendered", function () {
                var logView = document.getElementById('logView');
                logView.innerHTML = logView.innerHTML + "Rendered<br/>";

                // Report.off removes a given event handler if it exists.
                report.off("rendered");
            });
        };
    </script>

    <asp:HiddenField ID="accessToken" runat="server" />

    <header>
        <h1>
            Power BI Embed Report
        </h1>
        <h2>
            Basic Sample
            <br />
            First make sure you <a href="https://dev.powerbi.com/apps">register your app</a>. After registration, copy <u>Client ID</u> and <u>Client Secret</u> to web.config file.
            <br />
            The application will embed the first report from your Power BI account. If you wish to embed a specific report, please copy the report's ID and the corresponding group ID to web.config file.
        </h2>
    </header>

    <div>
        <h3>Select <b>"Get Report"</b> to embed the report.
        </h3>
        <asp:Button ID="getReportButton" runat="server" OnClick="getReportButton_Click" Text="Get Report" />
    </div>

    <div class="field">
        <div class="fieldtxt">Report Name</div>
        <asp:Textbox ID="txtReportName" runat="server" Width="750px"></asp:Textbox>
    </div>

    <div class="field">
        <div class="fieldtxt">Report Id</div>
        <asp:Textbox ID="txtReportId" runat="server" Width="750px"></asp:Textbox>
    </div>

    <div class="field">
        <div class="fieldtxt">Report Embed URL</div>
        <asp:Textbox ID="txtEmbedUrl" runat="server" Width="750px"></asp:Textbox>
    </div>
    <div class="error">
        <asp:Label ID="errorLabel" runat="server"></asp:Label>
    </div>
    <div>
        Embedded Report
        <br />
        <div ID="reportContainer" style="width: 900px; height: 500px"></div>
    </div>

    <div>
        Log View
        <br />
        <div ID="logView" style="width: 880px;"></div>
    </div>
</asp:Content>
