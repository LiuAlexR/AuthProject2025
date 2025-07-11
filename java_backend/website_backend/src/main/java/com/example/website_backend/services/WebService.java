package com.example.website_backend.services;

import org.springframework.stereotype.Service;

import com.example.website_backend.dto.LocationUpdate;
import com.example.website_backend.models.User;
import com.example.website_backend.models.UserExposed;
import com.example.website_backend.repositories.LocationRepository;
import com.example.website_backend.repositories.WebRepository;
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
        String usernamePassword = update.tid;
        int index = usernamePassword.indexOf('.'); //Assume user puts USERNAME.PASSWORD in tid
        String username = usernamePassword.substring(0, index);
        String password = usernamePassword.substring(index+1, usernamePassword.length());
        /**
         * TODO - Validate Credentials, get user id
         */
        int userID = 1;

        UserExposed user = new UserExposed(userID, update.lat, update.lon, update.alt, System.currentTimeMillis());
        locationRepository.save(update);
    }

}
