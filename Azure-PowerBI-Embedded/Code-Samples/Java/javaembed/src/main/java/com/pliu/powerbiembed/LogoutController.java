package com.pliu.powerbiembed;

/**
 * Created by pliu on 11/18/2016.
 */
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.microsoft.aad.adal4j.AuthenticationResult;

@Controller
@RequestMapping("/logout")
public class LogoutController {

    @RequestMapping(method = { RequestMethod.GET, RequestMethod.POST })
    public String postLogout(ModelMap model, HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession();
        AuthenticationResult result = (AuthenticationResult) session.getAttribute(AuthHelper.PRINCIPAL_SESSION_NAME);
        String redirectUrl = "/index";
        if (result != null) {
            try {
                httpRequest.getSession().invalidate();
                String authority = httpRequest.getServletContext().getInitParameter("authority");
                String tenant = httpRequest.getServletContext().getInitParameter("tenant");
                String currentUri = String.format("%s://%s:%s%s/index.jsp",
                       httpRequest.getScheme(), httpRequest.getServerName(),httpRequest.getServerPort(),
                       httpRequest.getContextPath());
                redirectUrl = String.format("redirect:%s%s/oauth2/logout?post_logout_redirect_uri=%s",
                        authority, tenant, URLEncoder.encode(currentUri, "UTF-8"));
            } catch (Exception e) {
                model.addAttribute("error", e);
                redirectUrl = "/error";
            }
        }
        return redirectUrl;
    }

}
