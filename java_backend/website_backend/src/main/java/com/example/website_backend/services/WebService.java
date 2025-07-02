package com.example.website_backend.services;

import com.example.website_backend.models.User;
import com.example.website_backend.repositories.WebRepository;
import org.springframework.stereotype.Service;

@Service
public class WebService {
    private final WebRepository webRepository;

    public WebService(WebRepository webRepository) {
        this.webRepository = webRepository;
    }

    public void saveUser(User user) {
        webRepository.save(user);
    }


    public User getUser(String username) {
        return webRepository.findByUsername(username);
    }
}
