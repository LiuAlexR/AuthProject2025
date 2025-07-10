package com.example.website_backend;

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

//@SpringBootApplication
public class WebsiteBackendApplication {
	public static void main(String[] args) {
		// SpringApplication.run(WebsiteBackendApplication.class, args);
		//https://www.mongodb.com/docs/drivers/java/sync/current/crud/insert/
		String connectionString = "mongodb://localhost:27017/";
		try (MongoClient mongoClient = MongoClients.create(connectionString)) {
			System.out.println("=> Connection successful : ");
			MongoDatabase theUsers = mongoClient.getDatabase("Life360");
			MongoCollection<Document> userPublic = theUsers.getCollection("userPublic");
			System.out.println(userPublic.insertOne(new Document("test", "three").append("moreTest", "two")));
		}
	}

}
