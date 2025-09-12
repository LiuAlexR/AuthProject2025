package com.example.website_backend.services;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.stereotype.Service;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.UpdateOptions;

@Service
public class WebService {
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
    public void saveLocation(Document document){
        String connectionString = "mongodb://localhost:27017/";
		MongoClient mongoClient = MongoClients.create(connectionString);
        MongoDatabase theUsers = mongoClient.getDatabase("Life360");
        MongoCollection<Document> userLocations = theUsers.getCollection("currentLocation");
        Bson filter = Filters.eq("user_id", document.get("user_id"));
        userLocations.updateOne(filter, new Document("$set", document), new UpdateOptions().upsert(true)); //TODO decide whether to upsert
    }
    // public List<LocationUpdate> getLocation() {
    //     return locationRepository.findTopByOrderByTstDesc(Pageable.ofSize(10));
    // }

}
