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
package com.pliu.powerbiembed;

import java.net.URI;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.http.NameValuePair;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.commons.codec.binary.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import com.microsoft.aad.adal4j.AuthenticationResult;

@Controller
@RequestMapping("/secure/report")
public class ReportController {

    @RequestMapping(method = { RequestMethod.GET, RequestMethod.POST })
    public String getReport(ModelMap model, HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession();
        AuthenticationResult result = (AuthenticationResult) session.getAttribute(AuthHelper.PRINCIPAL_SESSION_NAME);
        if (result == null) {
            model.addAttribute("//error", new Exception("AuthenticationResult not found in session."));
            return "/error";
        } else {
            try {
                String userid = result.getUserInfo().getDisplayableId();
                // a simple demo of row level security
                String username = "anyone"; //username can't be empty if RLS is enabled on data source
                String roles = "foo"; //empty role means you are authorized to see all data, more secure to default to block all
                if (userid.startsWith("me")) {
                    roles = ""; //see everything
                } else if (userid.charAt(0) == 'p') {
                    roles = "NWManager";
                } else if (userid.charAt(0) == 'a') {
                    username = "adventure-works\\\\pamela0";
                    roles = "Sales";
                }
                ServletContext cxt = session.getServletContext();
                String workspaceCollection = cxt.getInitParameter("workspaceCollection");
                String workspaceId = cxt.getInitParameter("workspaceId");
                String accessKey = cxt.getInitParameter("accessKey");
                String resourceId = cxt.getInitParameter("resourceId");
                String reporturl = httpRequest.getParameter("reporturl");
                String accessToken = ComputeJWTToken(workspaceCollection, workspaceId, resourceId, accessKey,
                        reporturl, username, roles);
                model.addAttribute("accessToken", accessToken);
                model.addAttribute("embedUrl", reporturl);
            } catch (Exception e) {
                model.addAttribute("error", e);
                return "/error";
            }
        }
        return "/secure/report";
    }

    private String ComputeJWTToken(String workspaceCollection, String workspaceId, String resourceId,
                                   String accessKey, String embedUrl,
                                   String username, String roles) throws Exception {
        List<NameValuePair> params = URLEncodedUtils.parse(new URI(embedUrl), "UTF-8");
        String reportId = "";
        for (NameValuePair param : params) {
            if (param.getName().equals("reportId")) {
                reportId = param.getValue();
                break;
            }
        }

        int unixTimestamp = (int)(System.currentTimeMillis() / 1000L) + 2 * 24 * 60 * 60; //expire in 2 days
        String pbieKey1 = "{\"typ\":\"JWT\",\"alg\":\"HS256\"}";
        String pbieKey2 = String.format(
                "{\"wid\":\"%s\",\"rid\":\"%s\",\"wcn\":\"%s\",\"iss\":\"PowerBISDK\",\"ver\":\"0.2.0\"," +
                "\"aud\":\"%s\",\"exp\":%d,\"username\":\"%s\",\"roles\":\"%s\"}",
                workspaceId, reportId, workspaceCollection,
                resourceId, unixTimestamp, username, roles);
        String pbieKey1n2ToBase64 = Base64UrlEncode(pbieKey1) + "." + Base64UrlEncode(pbieKey2);
        String pbieKey3 = HMAC256EncryptBase64UrlEncode(pbieKey1n2ToBase64, accessKey);

        return pbieKey1n2ToBase64 + "." + pbieKey3;
    }

    private String Base64UrlEncode (String str) throws Exception
    {
        byte[] strBytes = str.getBytes("UTF-8");
        String b64Str = new String(Base64.encodeBase64(strBytes));
        return b64Str.replace('/', '_').replace('+', '-').replaceAll("[=]+$", "");
    }

    private String HMAC256EncryptBase64UrlEncode(String str, String accessKey) throws Exception
    {
        byte[] key = accessKey.getBytes("UTF-8");
        byte[] strBytes = str.getBytes("UTF-8");
        Mac enc = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(key, "HmacSHA256");
        enc.init(secret_key);
        byte[] hashBytes = enc.doFinal(strBytes);
        String b64Str = new String(Base64.encodeBase64(hashBytes));
        return b64Str.replace('/', '_').replace('+', '-').replaceAll("[=]+$", "");
    }
}
