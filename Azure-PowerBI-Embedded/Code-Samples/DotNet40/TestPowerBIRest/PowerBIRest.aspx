<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PowerBIRest.aspx.cs" Inherits="TestPowerBIRest.PowerBIRest" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script type="text/javascript">

        window.onload = function () { // find the iFrame on the page and handle the loaded event.
            var iframe = document.getElementById('iFrameEmbedReport');
            //var iframe1 = document.getElementById('iFram');

            iframe.src = document.getElementById('embedUrlText').value;  //embedReportUrl;
            iframe.onload = postActionLoadReport;
            // post the access token to the iFrame to load the tile
            function postActionLoadReport() {
                // get the app token.
                accessToken = document.getElementById('accessTokenText').value;//{generate app token};
                // construct the push message structure
                var m = { action: "loadReport", accessToken: accessToken };
                message = JSON.stringify(m);
                // push the message.
                iframe = document.getElementById('iFrameEmbedReport');
                iframe.contentWindow.postMessage(message, "*");
                //iframe1.contentWindow.postMessage(message, "*");
            }
        };
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <div>
                <input type="hidden" id="accessTokenText" runat="server" value="" />
                <input type="hidden" id="embedUrlText" runat="server" value="" />
                <asp:Button ID="btn" runat="server" Text="Click" />
                <iframe id="iFrameEmbedReport" height="768" width="1024" seamless></iframe>
            </div>
    </form>
</body>
</html>
