<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="PBIWebApp._Default" %>
<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <!-- Sign in -->
    <div><h1 style="border-bottom:solid; border-bottom-color: silver">Power BI: Integrate report sample web applicaton</h1>
        <asp:Panel ID="signinPanel" runat="server" Visible="true">     
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
    <!-- Get Reports -->
    <div> 
        <asp:Panel ID="PanelReports" runat="server" Visible="true">
            <p><b class="step">Step 2</b>: Get reports from your account.</p>
            <table>

            <tr>
                <td><asp:Button ID="Button2" runat="server" OnClick="getReportsButton_Click" Text="Get Reports" /></td>
            </tr>
            <tr>  
                <td><asp:TextBox ID="tb_reportsResult" runat="server" Height="200px" Width="1024px" TextMode="MultiLine" Wrap="False"></asp:TextBox></td>
            </tr>

        </table>
        </asp:Panel>
    </div>
        <!-- Embed Report-->
    <div> 
        <asp:Panel ID="PanelEmbed" runat="server" Visible="true">
            <p><b class="step">Step 3</b>: Embed a report</p>
            <table>
                <tr><td>Enter an embed url for a report from Step 2 (starts with https://):<br />
                    <input type="text" id="tb_EmbedURL" style="width: 1024px;" />
            <tr>
                <td>
                    <input type="button" id="bEmbedReportAction" value="Embed Report" />
                </td>
            </tr>
                <tr>
                    <td>
                        <iframe ID="iFrameEmbedReport" src="" height="768px" width="1024px" frameborder="1" seamless></iframe>
                    </td>
                </tr>
        </table>
        </asp:Panel>
    </div>
</asp:Content>
