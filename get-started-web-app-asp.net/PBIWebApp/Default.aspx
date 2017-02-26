<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="PBIWebApp._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <!-- Sign in -->
    <div><h1 style="border-bottom:solid; border-bottom-color: silver">Power BI: Get datasets sample web applicaton</h1>
        <asp:Panel ID="signinPanel" runat="server" Visible="true">     
            <p><b class="step">Step 1</b>: Sign in to your Power BI account to link your account to this web application.</p>
            <p>
                <asp:Button ID="signInButton" runat="server" OnClick="signInButton_Click" Text="Sign in to Power BI" />
            </p>   
        </asp:Panel>   
    </div>

    <!-- Get datasets -->
    <div> 
        <asp:Panel ID="PBIPanel" runat="server" Visible="false">
            <p><b class="step">Step 2</b>: Get your datasets.</p>
            <table>

            <tr>
                <td><asp:Button ID="getDatasetsButton" runat="server" OnClick="getDatasetsButton_Click" Text="Get Datasets" /></td>
            </tr>
            <tr>  
                <td><asp:TextBox ID="resultsTextbox" runat="server" Height="200px" Width="586px" TextMode="MultiLine" Wrap="False"></asp:TextBox></td>
            </tr>

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
    </div>

</asp:Content>
