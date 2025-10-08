package com.example.website_backend.services;

import org.bson.Document;
import org.springframework.stereotype.Service;

import com.example.website_backend.dto.LocationUpdate;
import com.example.website_backend.models.UserExposed;
import com.example.website_backend.models.UserFetchRequestModel;

@Service
public class WebService {
    private final DatabaseService databaseService = new DatabaseService();
    private final MathService mathService = new MathService();
//     private final WebRepository webRepository;
//     private final LocationRepository locationRepository;

//     public WebService(WebRepository webRepository, LocationRepository locationRepository) {
//         this.webRepository = webRepository;
//         this.locationRepository = locationRepository;
//     }

//     public void saveUser(User user) {
//         webRepository.save(user);
//     }


//     public User getUser(String username) {
//         return webRepository.findByUsername(username);
//     }

//     // TODO FINISH THIS
//     public boolean insertUser(UserExposed data){
//         return false;
//     }
    
//     public void receiveLocation(LocationUpdate update) {
//         String usernamePassword = update.tid;
// //        int index = usernamePassword.indexOf('.'); //Assume user puts USERNAME.PASSWORD in tid
// //        String username = usernamePassword.substring(0, index);
// //        String password = usernamePassword.substring(index+1, usernamePassword.length());
//         /**
//          * TODO - Validate Credentials, get user id
//          */
//         int userID = 1;
// //
// //        UserExposed user = new UserExposed(userID, update.lat, update.lon, update.alt, System.currentTimeMillis());
//         locationRepository.save(update);
//     }
    
    // public List<LocationUpdate> getLocation() {
    //     return locationRepository.findTopByOrderByTstDesc(Pageable.ofSize(10));
    // }

    public Document getAuthDocument(String username) throws Exception{
        var document = databaseService.getAuthDocument(username);
        if (document == null) {
            throw new Exception("User not found");
        }
        return document;
    }

    public void updateUser(int userId, LocationUpdate update) {
        UserExposed theUser = new UserExposed(0, 0, 0, 0, 0);
            theUser.setUser_id(userId);
            theUser.setDatetime(System.currentTimeMillis());
            theUser.setLatitude(update.lat);
            theUser.setLongitude(update.lon);
            theUser.setAltitude(update.alt);

            databaseService.saveLocation(theUser.getDocument());
    }
    public String parseRequest(UserFetchRequestModel request) {
        var jwt = request.getJwt();
        var isValid = mathService.verifyJWTSignature(jwt);
        if(!isValid && !(jwt.equals("ADMIN"))){
            return "Error. Invalid JWT token";
        }
        String locations = "{";
        for(var i : request.getFetchableIDs()){
            var location = databaseService.getLocation(i);
            if(location == null){
                continue;
            }
            locations = locations + location.toJson() + ", ";
        }
        if(locations.indexOf(locations.length()-1) == ' '){
            locations = locations.substring(0, locations.length()-2);
        }
        locations = locations + "}";
        return locations;
    }
}
