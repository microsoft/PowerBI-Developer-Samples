<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="PBIWebApp._Default" %>

<asp:Content ID="BodyContent" ContentPlaceHolderID="MainContent" runat="server">
    <script type="text/javascript">

        //This code is for sample purposes only.

        //Configure IFrame for the Report after you have an Access Token. See Default.aspx.cs to learn how to get an Access Token
        window.onload = function () {
            if ("" != document.getElementById('MainContent_accessToken').value)
            {
                var iframe = document.getElementById('iFrameEmbedReport');

                // To load a Report do the following:
                // Set the IFrame source to the EmbedUrl from the Get Reports operation
                iframe.src = document.getElementById('MainContent_ReportEmbedUrl').value;

                // Add an onload handler to submit the access token
                iframe.onload = postActionLoadReport;
            }
        };
        
        // Post the access token to the IFrame
        function postActionLoadReport() {

            // Construct the push message structure
            // this structure also supports setting the reportId, groupId, height, and width.
            // when using a report in a group, you must provide the groupId on the iFrame SRC
            var m = {
                action: "loadReport",
                accessToken: document.getElementById('MainContent_accessToken').value
            };
            message = JSON.stringify(m);

            // push the message.
            iframe = document.getElementById('iFrameEmbedReport');
            iframe.contentWindow.postMessage(message, "*");;
        }

    </script>
    <asp:HiddenField ID="accessToken" runat="server" />
    <asp:Button ID="getReportButton" runat="server" OnClick="getReportButton_Click" Text="Get Report" />  

    <table>
        <tr><td>Report Embed URL</td> <td><asp:Textbox ID="ReportEmbedUrl" runat="server" Width="900px"></asp:Textbox></td></tr>

        <tr><td>Report</td><td></td></tr>
        <tr><td></td><td>
            <iframe ID="iFrameEmbedReport" height="500px" width="900px"></iframe>
        </td></tr>   
    </table>
</asp:Content>
