package com.example.pfs.service;

//package com.example.pfs.service;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import com.example.pfs.model.user;


import java.util.Collection;
import java.util.Map;

@Data
public class CustomOAuth2User implements OAuth2User {
    private user user;
    private Map<String, Object> attributes;

    public CustomOAuth2User(user user, Map<String, Object> attributes) {
        this.user = user;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null; // Add roles if needed
    }

    @Override
    public String getName() {
        return user.getUsername(); // Or another unique identifier
    }
}
