<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
 
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="base" value="${fn:substring(url, 0, fn:length(url) - fn:length(req.requestURI))}${req.contextPath}/" />
 
<!DOCTYPE html>
<html lang="en">
<head>
	<title>Embedded Power BI report</title>
	<base href="${base}"/>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
	<link href="resources/css/style.css" rel="stylesheet"/>
</head>
<body>
	<header class="embed-container col-lg-12 col-md-12 col-sm-12 shadow">
        <div>
            Power BI Embedded Sample
        </div>
    </header>
    <main class="row">
        <section id="text-container" class="embed-container col-lg-4 col-md-4 col-sm-4 mb-5 ml-5 mt-5">
            <div>
                <div>
                	This sample is developed using Spring MVC framework.<br/>
                    In order to see a different report, make changes to the <strong> /config/Config.java </strong> file.<br/>
                </div>
                <div>Code is present in the following files:
                    <ol>
                        <li>controllers/EmbedController.java</li>
                        <li>services/AzureADService.java</li>
                        <li>services/PowerBIService.java</li>
                        <li>EmbedReport.jsp</li>
                    </ol>
                </div>
            </div>
        </section>
		<section id="report-container" class="embed-container col-lg-offset-4 col-lg-7 col-md-offset-5 col-md-7 col-sm-offset-5 col-sm-7 mt-5"></section>
		
		<!-- Used to display report embed error message -->
        <section class="error-container m-5"></section>
    </main>
    <footer class="embed-container col-lg-12 col-md-12 col-sm-12 mb-0 mt-4 text-center">
		For Live demo and more code samples please visit 
		<a href="https://aka.ms/EmbeddedPlayground">https://aka.ms/EmbeddedPlayground</a>
		<br>
		For JavaScript API, please visit 
		<a href="https://aka.ms/PowerBIjs">https://aka.ms/PowerBIjs</a>
    </footer>
    
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
    
    <!-- powerbi-client v2.10.3 -->
    <script src="resources/js/powerbi.min.js"></script>
	
	<script>
		$(function () {
		    models = window['powerbi-client'].models;
		    
		    reportLoadConfig = {
		        type: "report",
		        hostname: "https://app.powerbi.com/", // for public cloud
		        tokenType: models.TokenType.Embed,
		        accessToken: "",
		        embedUrl: "",
		        settings: {}
		    };
		    
		    reportContainer = $("#report-container").get(0);
		    
		    // Initialize iframe for embedding report
		    powerbi.bootstrap(reportContainer, reportLoadConfig);
		    
		    // Request to get embed details
		    $.ajax({
		        type: "GET",
		        url: "/appownsdatasample/getembedinfo",
		        dataType: "json",
		        success: function (embedData) {
		        	
		            reportLoadConfig["accessToken"] = embedData["embedToken"];
		            reportLoadConfig["embedUrl"] = embedData["embedUrl"];
		            
			        // Use the token expiry to regenerate Embed token for seamless end user experience
		            // Refer https://aka.ms/RefreshEmbedToken
		            tokenExpiry = embedData["tokenExpiry"]
		            
		            // Embed Power BI report when Access token and Embed URL are available
		            report = powerbi.embed(reportContainer, reportLoadConfig);
                
                	// Triggers when a report schema is successfully loaded
		            report.on("loaded", function () {
		                console.log("Report load successful");
		            });
		         	
			        // Triggers when a report is successfully embedded in UI
		            report.on("rendered", function () {
		                console.log("Report render successful");
                	});
                
		            // Clear any other error handler event
		            report.off("error");
		            // Below patch of code is for handling errors that occur during embedding
		            report.on("error", function (event) {
		                errorMsg = event.detail;
		                // Use errorMsg variable to log error in any destination of choice
		                console.error(errorMsg);
		                return;
		            });
		        },
		        error: function (err) {
		        	
		        	// Show error container
					$(".embed-container").hide();
					var errorContainer = $(".error-container");
		        	errorContainer.show();
		        	
		        	// Format error message
		        	var errMessageHtml = "<strong> Error Details: </strong> <br/>"
		        	errMessageHtml += err.responseText.split("\n").join("<br/>")
		        	
		        	// Show error message on UI
		        	errorContainer.html(errMessageHtml);
		        }
		    });
		});
	</script>
</body>
</html>