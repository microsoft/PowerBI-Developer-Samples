<%@ Page Title="Embed Dashboard" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="EmbedDashboard.aspx.cs" Inherits="PBIWebApp.EmbedDashboard" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <link rel="stylesheet" href="/css/master.css" type="text/css" />
    <script src="https://npmcdn.com/es6-promise@3.2.1"></script>
    <script type="text/javascript" src="scripts/powerbi.js"></script>

    <script type="text/javascript">

        window.onload = function () {
            // client side click to embed a selected dashboard.
            var el = document.getElementById("bEmbedDashboardAction");
            if (el.addEventListener) {
                el.addEventListener("click", updateEmbedDashboard, false);
            } else {
                el.attachEvent('onclick', updateEmbedDashboard);
            }

            // handle server side post backs, optimize for reload scenarios
            // show embedded dashboard if all fields were filled in.
            var accessTokenElement = document.getElementById('MainContent_accessTokenTextbox');
            if (accessTokenElement !== null) {
                var accessToken = accessTokenElement.value;
                if (accessToken !== "")
                    updateEmbedDashboard();
            }
        };

        // update embed dashboard
        function updateEmbedDashboard() {

            // check if the embed url was selected
            var embedUrl = document.getElementById('tb_EmbedURL').value;
            if (embedUrl === "")
                return;

            // get the access token.
            accessToken = document.getElementById('MainContent_accessTokenTextbox').value;

            // Embed configuration used to describe the what and how to embed.
            // This object is used when calling powerbi.embed.
            // You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
            var config = {
                type: 'dashboard',
                accessToken: accessToken,
                embedUrl: embedUrl
            };

            // Grab the reference to the div HTML element that will host the dashboard.
            var dashboardContainer = document.getElementById('dashboardContainer');

            // Embed the dashboard and display it within the div container.
            var dashboard = powerbi.embed(dashboardContainer, config);

            // dashboard.on will add an event handler which prints to Log window.
            dashboard.on("tileClicked", function (event) {
                var logView = document.getElementById('logView');
                logView.innerHTML = logView.innerHTML + "Tile Clicked<br/>";
                logView.innerHTML = logView.innerHTML + JSON.stringify(event.detail, null, "  ") + "<br/>";
                logView.innerHTML = logView.innerHTML + "---------<br/>";
            });

            // dashboard.on will add an event handler which prints to Log window.
            dashboard.on("error", function (event) {
                var logView = document.getElementById('logView');
                logView.innerHTML = logView.innerHTML + "Error<br/>";
                logView.innerHTML = logView.innerHTML + JSON.stringify(event.detail, null, "  ") + "<br/>";
                logView.innerHTML = logView.innerHTML + "---------<br/>";
            });
        }
    </script>

    <!-- Sign in -->
    <div><h1 style="border-bottom:solid; border-bottom-color: silver">Power BI Embed Dashboard</h1>
        <asp:Panel ID="SignInPanel" runat="server" Visible="true">     
            <p><b class="step">Step 1</b>: Sign in to your Power BI account to link your account to this web application.</p>
            <p>
                <asp:Button ID="signInButton" runat="server" OnClick="signInButton_Click" Text="Sign in to Power BI" />
            </p>   

            <asp:Panel ID="signInStatus" runat="server" Visible="false">
                <table>
                    <tr>
                        <td><b>Signed in as:</b></td>
                    </tr>
                    <tr>
                        <td><asp:Label ID="userLabel" runat="server"></asp:Label></td>
                    </tr>
                    <tr>
                        <td><b>Access Token:</b></td>
                    </tr>
                    <tr>
                        <td><asp:TextBox ID="accessTokenTextbox" runat="server" Width="586px"></asp:TextBox></td>
                    </tr>

                </table>
            </asp:Panel>
        </asp:Panel>   
    </div>

    <hr class="stepHr" />

    <!-- Get Dashboards -->
    <div> 
        <asp:Panel ID="PanelDashboards" runat="server" Visible="true">
            <div>
                <div><b class="step">Step 2</b>: Get dashboards from your account.</div>
                <asp:Button ID="Button1" runat="server" OnClick="getDashboardsButton_Click" Text="Get Dashboards" />
            </div>

            <div class="gridWrapper">
                <asp:GridView ID="GridView1" runat="server" CssClass="grid" Width="1018px"></asp:GridView>
            </div>
        </asp:Panel>
    </div>

    <hr class="stepHr" />

    <!-- Embed Dashboard-->
    <div> 
        <asp:Panel ID="PanelEmbed" runat="server" Visible="true">
            <div>
                <div><b class="step">Step 3</b>: Embed a dashboard</div>

                <div>Enter an embed url for a dashboard from Step 2 (starts with https://):</div>
                <input type="text" id="tb_EmbedURL" style="width: 1024px;" />
                <br />
                <input type="button" id="bEmbedDashboardAction" value="Embed Dashboard" />
            </div>

            <div id="dashboardContainer" width: 100% hight: 100% ></div>
        </asp:Panel>
    </div>

    <div class="logViewWrap">
        Log View
        <br />
        <div ID="logView" style="width: 880px;"></div>
    </div>
</asp:Content>
