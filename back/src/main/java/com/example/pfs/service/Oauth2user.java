package com.example.pfs.service;

import com.example.pfs.model.User;
import com.example.pfs.repository.userrepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class Oauth2user implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Autowired
    private userrepository ur;

//    @Autowired
//    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        try {
            OAuth2User oauth2User = new DefaultOAuth2UserService().loadUser(userRequest);
            Map<String, Object> attributes = oauth2User.getAttributes();

            // Validate required attributes
            String email = (String) attributes.get("email");
            if (email == null) {
                throw new OAuth2AuthenticationException("Email not found in OAuth2 attributes");
            }

            String fullname = (String) attributes.get("name");
            if (fullname == null) {
                fullname = email.split("@")[0]; // Default to email prefix if name not provided
            }
            final String fullname1=fullname;
            User existingUser = ur.findByEmail(email)
                    .orElseGet(() -> {
                        // Create new user if not found
                        User newUser = new User();
                        newUser.setEmail(email);
                        newUser.setUsername(email.split("@")[0]);
                        newUser.setFullname(fullname1);
                        newUser.setPassword("");
                        return ur.save(newUser);

                    });

            return new CustomOAuth2User(existingUser, attributes);

        } catch (Exception ex) {
            throw new OAuth2AuthenticationException("Authentication processing failed");
        }
    }
}