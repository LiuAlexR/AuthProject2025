package com.example.website_backend.services;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.stereotype.Service;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.UpdateOptions;

@Service
public class DatabaseService {
    String connectionString = "mongodb://localhost:27017/";
    MongoClient mongoClient = MongoClients.create(connectionString);
    MongoDatabase theUsers = mongoClient.getDatabase("Life360");
    public Document getAuthDocument(String username) {
        MongoCollection<Document> userPublic = theUsers.getCollection("authentication");
        // System.out.println(userPublic.insertOne(new Document("test", "three").append("moreTest", "two")));
        FindIterable<Document> item = userPublic.find(new Document("username", username));
        return item.first(); //Will be null if user is not found, handle it then. Users with the same username are enforced to not exist at user creation
    }
    /**
     * Saves a user's location to the databse, with upsert
     * @param document
     */
    public void saveLocation(Document document){
        MongoCollection<Document> userLocations = theUsers.getCollection("relations");
        Bson filter = Filters.eq("user_id", document.get("user_id"));
        userLocations.updateOne(filter, new Document("", document), new UpdateOptions().upsert(true)); //TODO decide whether to upsert
    }
}
