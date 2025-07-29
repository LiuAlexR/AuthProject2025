package com.example.website_backend;

import org.bson.BsonDocument;
import org.bson.Document;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.website_backend.services.MathService;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

@SpringBootApplication
public class WebsiteBackendApplication {
	public static void main(String[] args) {
		 // SpringApplication.run(WebsiteBackendApplication.class, args);

		
		//https://www.mongodb.com/docs/drivers/java/sync/current/crud/insert/
		String connectionString = "mongodb://localhost:27017/";
		try (MongoClient mongoClient = MongoClients.create(connectionString)) {
			System.out.println("=> Connection successful : ");
			MongoDatabase theUsers = mongoClient.getDatabase("Life360");
			MongoCollection<Document> userPublic = theUsers.getCollection("authentication");
			// System.out.println(userPublic.insertOne(new Document("test", "three").append("moreTest", "two")));
			FindIterable<Document> item = userPublic.find(new Document("username", "Bob"));
			int id = (int) item.first().get("user_id");
			System.out.println(id);
		} catch (Exception e) {
			System.out.println("Hi");
		}
		// MathService math = new MathService();
		// boolean verified = math.verifyJWTSignature("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiNTI1NDk5ODU5MjF9.tYoDsfVnUo7koyVeELrdi_b-EF7GyJWuZ4SmBEf_cMI=");
		// System.out.println(verified);
	}

}
