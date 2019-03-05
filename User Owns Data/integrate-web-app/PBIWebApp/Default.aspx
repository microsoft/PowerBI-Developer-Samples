<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="PBIWebApp._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <header>
        <h1>
            Power BI Api Sample
        </h1>
        <h2>
            Basic Sample
            <br />
            First make sure you <a href="https://dev.powerbi.com/apps">register your app</a>. After registration, copy <u>Application ID</u> and <u>Application Secret</u> to Cloud.config file.
            <br />
            <br />
            <b>Choose element to embed:</b>
            <br />
        </h2>
    </header>

    <div>
        <asp:Button ID="embedReport" runat="server" OnClick="embedReportButton_Click" Text="Embed Report" />
    </div>
    <div>
        <asp:Button ID="embedDashboard" runat="server" OnClick="embedDashboardButton_Click" Text="Embed Dashboard" />
    </div>
    <div>
        <asp:Button ID="embedTile" runat="server" OnClick="embedTileButton_Click" Text="Embed Tiles" />
    </div>
</asp:Content>
