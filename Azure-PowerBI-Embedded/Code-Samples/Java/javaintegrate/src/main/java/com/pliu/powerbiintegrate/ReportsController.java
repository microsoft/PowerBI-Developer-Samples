/*******************************************************************************
 * Copyright © Microsoft Open Technologies, Inc.
 *
 * All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS//
 * OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
 * ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A
 * PARTICULAR PURPOSE, MERCHANTABILITY OR NON-INFRINGEMENT.
 *
 * See the Apache License, Version 2.0 for the specific language
 * governing permissions and limitations under the License.
 ******************************************************************************/
package com.pliu.powerbiintegrate;

import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.microsoft.aad.adal4j.AuthenticationResult;

@Controller
@RequestMapping("/secure/reports")
public class ReportsController {

    @RequestMapping(method = { RequestMethod.GET, RequestMethod.POST })
    public String getReports(ModelMap model, HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession();
        AuthenticationResult result = (AuthenticationResult) session.getAttribute(AuthHelper.PRINCIPAL_SESSION_NAME);
        if (result == null) {
            model.addAttribute("//error", new Exception("AuthenticationResult not found in session."));
            return "/error";
        } else {
            Report[] data;
            try {
                data = getReportsFromPowerBI(result.getAccessToken());
                model.addAttribute("reports", data);
            } catch (Exception e) {
                model.addAttribute("error", e);
                return "/error";
            }
        }
        return "/secure/reports";
    }

    private Report[] getReportsFromPowerBI(String accessToken) throws Exception {
        URL url = new URL("https://api.powerbi.com/v1.0/myorg/reports");

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestProperty("Authorization", String.format("Bearer %s", accessToken));
        String goodRespStr = HttpClientHelper.getResponseStringFromConn(conn, true);
        int responseCode = conn.getResponseCode();
        JSONObject response = HttpClientHelper.processGoodRespStr(responseCode, goodRespStr);

        JSONArray jreports = JSONHelper.fetchDirectoryObjectJSONArray(response);
        int numReports = jreports.length();

        Report[] reports = new Report[numReports];
        for (int i = 0; i < numReports; i++) {
            JSONObject thisReportJSONObject = jreports.optJSONObject(i);
            reports[i] = new Report();
            JSONHelper.convertJSONObjectToDirectoryObject(thisReportJSONObject, reports[i]);
        }
        return reports;
    }

}
