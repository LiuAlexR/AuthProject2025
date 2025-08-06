package com.example.website_backend.controllers;

import com.example.website_backend.dto.LocationUpdate;
import com.example.website_backend.models.User;
import com.example.website_backend.models.UserExposed;
import com.example.website_backend.services.WebService;

import org.bson.Document;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping(path = "Webserver/")
public class WebController {
    HttpClient client = HttpClient.newHttpClient();
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
    @CrossOrigin(origins = "*")
    @PostMapping("/data")
    public ResponseEntity<String> receiveLocation(@RequestBody LocationUpdate update) {
        System.out.println("Data received");
        webService.receiveLocation(update);
        return ResponseEntity.ok("Received");
    }
    @CrossOrigin(origins = "*")
    @PostMapping("/data/{username}")
    public ResponseEntity<String> receiveLocation(@PathVariable String username, @RequestBody LocationUpdate update) {
        Document auth;
        try {
            auth = webService.getAuthDocument(username);
        } catch (Exception e) {
            System.out.println("User " + username + " was not found");
            return new ResponseEntity<>("User Not Found", HttpStatus.BAD_REQUEST);
        }
        // String jsonPayload = String.format("{\"username\":\"%s\",\"password\":\"%s\"}", username, update.tid);
        try {
            // HttpRequest request = HttpRequest.newBuilder()
            //         .uri(new URI("http://localhost:8081/verify_login"))
            //         .timeout(Duration.ofSeconds(10))
            //         .header("Content-Type", "application/json")
            //         .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
            //         .build();

            // HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // if (response.statusCode() != 200) {
            //     System.out.println("Failed to verify user. Status code: " + response.statusCode());
            //     return new ResponseEntity<>(response.body(), HttpStatus.UNAUTHORIZED);
            // }

            // String jwt = response.body();
            // System.out.println("Login successful. JWT received: " + jwt);

            UserExposed theUser = new UserExposed(0, 0, 0, 0, 0);
            theUser.setUser_id((int) auth.get("user_id"));
            theUser.setDatetime(System.currentTimeMillis());
            theUser.setLatitude(update.lat);
            theUser.setLongitude(update.lon);
            theUser.setAltitude(update.alt);

            webService.saveLocation(theUser.getDocument());
            
            System.out.println("Data received and saved for " + username);
            return ResponseEntity.ok("Received");

        } catch (Exception e) {
            System.out.println("Error calling authentication service: " + e.getMessage());
            return new ResponseEntity<>("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @CrossOrigin(origins = "*")
    @GetMapping("/getLocation")
    public List<LocationUpdate> getLocation() {
        return webService.getLocation();
    }
}
