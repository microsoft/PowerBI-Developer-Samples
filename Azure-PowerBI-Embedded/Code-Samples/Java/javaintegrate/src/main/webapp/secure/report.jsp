<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Report</title>
    <script type="text/javascript">
        window.onload = function () {
            var iframeT = document.getElementById('reportContainer');
            iframeT.src = '${embedUrl}';
            iframeT.onload = postActionLoadReport;
        }

        function postActionLoadReport() {
            // Construct the push message structure
            // This is where you assign the Access Token to get access to the tile visual
            var messageStructure = {
                action: "loadReport",
                accessToken: '${accessToken}'
            };
            message = JSON.stringify(messageStructure);
            // Push the message
            document.getElementById('reportContainer').contentWindow.postMessage(message, "*");;
        }
    </script>
</head>
<body>

    <div>
        <iframe id="reportContainer" height="700" width="100%"></iframe>
    </div>

</body>
</html>