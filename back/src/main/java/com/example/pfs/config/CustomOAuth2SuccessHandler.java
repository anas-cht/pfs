package com.example.pfs.config;

import com.example.pfs.dto.userdto;
import com.example.pfs.service.userserviceimpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private userserviceimpl usr;
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        try {
            OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
            String email = oauth2User.getAttribute("email");

            if (email == null) {
                throw new IllegalStateException("Email not found in OAuth2 user");
            }
            String redirectUrl = "http://localhost:5173?oauthSuccess=true&email=" +
                    URLEncoder.encode(email, StandardCharsets.UTF_8);

            response.sendRedirect(redirectUrl);

        } catch (Exception ex) {
            String errorRedirectUrl = "http://localhost:5173/error?message=" +
                    URLEncoder.encode(ex.getMessage(), StandardCharsets.UTF_8);
            response.sendRedirect(errorRedirectUrl);
        }
    }
}
