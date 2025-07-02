package com.example.website_backend.controllers;

import com.example.website_backend.dto.LocationUpdate;
import com.example.website_backend.models.User;
import com.example.website_backend.services.WebService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "Webserver/")
public class WebController {
    private final WebService webService;

    public WebController(WebService webService) {
        this.webService = webService;
    }

//    @CrossOrigin("origins = *")
//    @PostMapping("/saveUser/{user}")
//    public void saveUser(@PathVariable User user) {
//        webService.saveUser(user);
//    }

    @CrossOrigin(origins = "*")
    @GetMapping("/test")
    public String test() {
        System.out.println("Called");
        return "Hello World";
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/saveUser")
    public String saveUser() {
        User user = new User();
        user.setUsername("Lebron");
        user.setUsersToWatch(new String[]{"Kyrie,Kevin,Russell,Chris,Dwyane"});
        user.setUsersThatCanWatch(new String[]{"Bronny"});
        user.setCurrentLocation(new double[]{0.0,100.0});

        webService.saveUser(user);

        return "Working";
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/getUser/{username}")
    public String getUser(@PathVariable String username) {
        User user = webService.getUser(username);
        return user.toString();
    }

    @PostMapping("/data")
    public ResponseEntity<String> receiveLocation(@RequestBody LocationUpdate update) {
        webService.receiveLocation(update);
        return ResponseEntity.ok("Received");
    }
}
