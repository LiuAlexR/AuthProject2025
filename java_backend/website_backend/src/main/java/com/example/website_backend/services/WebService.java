package com.example.website_backend.services;

import com.example.website_backend.dto.LocationUpdate;
import com.example.website_backend.models.User;
import com.example.website_backend.repositories.LocationRepository;
import com.example.website_backend.repositories.WebRepository;
import org.springframework.stereotype.Service;

@Service
public class WebService {
    private final WebRepository webRepository;
    private final LocationRepository locationRepository;

    public WebService(WebRepository webRepository, LocationRepository locationRepository) {
        this.webRepository = webRepository;
        this.locationRepository = locationRepository;
    }

    public void saveUser(User user) {
        webRepository.save(user);
    }


    public User getUser(String username) {
        return webRepository.findByUsername(username);
    }

    public void receiveLocation(LocationUpdate update) {
        locationRepository.save(update);
    }
}
