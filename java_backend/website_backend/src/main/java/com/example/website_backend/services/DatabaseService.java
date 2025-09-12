package com.example.website_backend.services;

import org.bson.Document;
import org.springframework.stereotype.Service;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

@Service
public class DatabaseService {
    String connectionString = "mongodb://localhost:27017/";
    MongoClient mongoClient = MongoClients.create(connectionString);
    MongoDatabase theUsers = mongoClient.getDatabase("Life360");
    public Document getAuthDocument(String username) {
        MongoCollection<Document> userPublic = theUsers.getCollection("authentication");
        // System.out.println(userPublic.insertOne(new Document("test", "three").append("moreTest", "two")));
        FindIterable<Document> item = userPublic.find(new Document("username", username));
        return item.first(); //Will throw error if user is not found, handle it then. Users with the same username are enforced to not exist at user creation
    }
}
