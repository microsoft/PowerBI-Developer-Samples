package com.embedsample.appownsdata.controllers;

import com.embedsample.appownsdata.config.Config;
import com.embedsample.appownsdata.models.EmbedConfig;
import com.embedsample.appownsdata.services.AzureADService;
import com.embedsample.appownsdata.services.PowerBIService;

import java.net.MalformedURLException;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class EmbedController {
	
	static final Logger logger = LoggerFactory.getLogger(EmbedController.class);

	/** 
	 * Home page controller
	 * @return Homepage (jsp)
	 */
	@GetMapping(path = "/")
	public ModelAndView embedReportHome() {
		
		// Return homepage JSP view
		return new ModelAndView("EmbedReport");
	}
	
	/** 
	 * Embedding details controller
	 * @return ResponseEntity<String> body contains the JSON object with embedUrl and embedToken 
	 */
	@GetMapping(path = "/getembedinfo")
	@ResponseBody
	public ResponseEntity<String> embedInfoController() {
	
		// Get access token
		String accessToken;
		try {
			accessToken = AzureADService.getAccessToken();
		} catch (ExecutionException | MalformedURLException | RuntimeException ex) {
			// Log error message
			logger.error(ex.getMessage());
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
			
		} catch (InterruptedException interruptedEx) {
			// Log error message
			logger.error(interruptedEx.getMessage());
			
			Thread.currentThread().interrupt();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(interruptedEx.getMessage());
		}
		
		// Get required values for embedding the report
		try {
			// Get report details
			EmbedConfig reportEmbedConfig = PowerBIService.getReportEmbedDetails(Config.reportId, Config.groupId, accessToken);	

			// Get embed token
			reportEmbedConfig.embedToken = PowerBIService.getMultiResourceEmbedToken(reportEmbedConfig.reportId, reportEmbedConfig.datasetId, accessToken);
			
			// Return JSON response in string
			JSONObject responseObj = new JSONObject();
			responseObj.put("embedToken", reportEmbedConfig.embedToken.token);
			responseObj.put("embedUrl", reportEmbedConfig.embedUrl);
			responseObj.put("tokenExpiry", reportEmbedConfig.embedToken.expiration);
			
			String response = responseObj.toString();
			return ResponseEntity.ok(response);
			
		} catch (HttpClientErrorException hcex) {
			// Build the error message
			StringBuilder errMsgStringBuilder = new StringBuilder("Error: "); 
			errMsgStringBuilder.append(hcex.getMessage());

			// Get Request Id
			HttpHeaders header = hcex.getResponseHeaders();
			List<String> requestIds = header.get("requestId");
			if (requestIds != null) {
				for (String requestId: requestIds) {
					errMsgStringBuilder.append("\nRequest Id: ");
					errMsgStringBuilder.append(requestId);
				}
			}
			
			// Error message string to be returned
			String errMsg = errMsgStringBuilder.toString();
			
			// Log error message
			logger.error(errMsg);
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errMsg);
			
		} catch (RuntimeException rex) {
			// Log error message
			logger.error(rex.getMessage());
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(rex.getMessage());
		}
	}
}