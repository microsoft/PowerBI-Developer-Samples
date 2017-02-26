<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="PBIWebApp._Default" %>
<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">

    <!-- Sign in -->
    <div><h1 style="border-bottom:solid; border-bottom-color: silver">Power BI: Get datasets sample web applicaton</h1>
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

        <!-- Get dashboards -->
    <div> 
        <asp:Panel ID="GroupsResults" runat="server" Visible="false">
            <p><b class="step">Step 1.1</b>: Get groups from your account.</p>
            <table>

            <tr>
                <td><asp:Button ID="Button_GetGroups" runat="server" OnClick="getGroupsButton_Click" Text="Get Groups" /></td>
            </tr>
            <tr>  
                <td><asp:TextBox ID="tb_GroupsResults" runat="server" Height="200px" Width="586px" TextMode="MultiLine" Wrap="False"></asp:TextBox></td>
            </tr>

        </table>
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

        </table>
        </asp:Panel>
    </div>


    <!-- Get dashboards -->
    <div> 
        <asp:Panel ID="PanelDashboards" runat="server" Visible="true">
            <p><b class="step">Step 3</b>: Get dashboards from your account.</p>
            <table>

            <tr>
                <td><asp:Button ID="Button2" runat="server" OnClick="getDashboardsButton_Click" Text="Get Dashboards" /></td>
            </tr>
            <tr>  
                <td><asp:TextBox ID="tb_dashboardsResult" runat="server" Height="200px" Width="586px" TextMode="MultiLine" Wrap="False"></asp:TextBox></td>
            </tr>

        </table>
        </asp:Panel>
    </div>

    <!-- Get tiles -->
    <div> 
        <asp:Panel ID="TilesStep" runat="server" Visible="true">
            <p><b class="step">Step 4</b>: Get tiles from your dashboards.</p>
            <table>
                <tr><td>Enter a dashboard id from step 3:<asp:TextBox ID="inDashboardID" runat="server" TextMode="SingleLine" Wrap="false"></asp:TextBox></td></tr>

            <tr>
                <td><asp:Button ID="Button1" runat="server" OnClick="getTilesButton_Click" Text="Get Tiles" /></td>
            </tr>
            <tr>  
                <td><asp:TextBox ID="tb_tilesResult" runat="server" Height="200px" Width="1024px" TextMode="MultiLine" Wrap="False"></asp:TextBox></td>
            </tr>

        </table>
        </asp:Panel>
    </div>

        <!-- Embed Tile-->
    <div> 
        <asp:Panel ID="PanelEmbedTile" runat="server" Visible="true">
            <p><b class="step">Step 5</b>: Embed a tile</p>
            <table>
                <tr><td>Enter an embed url for a tile from Step 4 (starts with https://):
                    <input type="text" id="tb_EmbedURL" />
                    <%--<asp:TextBox ID="tb_EmbedURL" TextMode="SingleLine" runat="server" Wrap="false"></asp:TextBox></td></tr>--%>

            <tr>
                <td><%--<asp:Button ID="bEmbedTileAction" runat="server" Text="Embed Tile" />--%>
                    <input type="button" id="bEmbedTileAction" value="Embed Tile" />
                </td>
            </tr>
                <tr>
                    <td>
                        <iframe ID="iFrameEmbedTile" src="" height="500px" width="500px" frameborder="0" seamless></iframe>
                    </td>
                </tr>
            <tr>  
                <%--<td><asp:TextBox ID="TextBox2" runat="server" Height="200px" Width="1024px" TextMode="MultiLine" Wrap="False"></asp:TextBox></td>--%>
            </tr>

        </table>
        </asp:Panel>
            

    </div>


</asp:Content>
