package com.example.website_backend;

import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.website_backend.services.MathService;

@SpringBootApplication
public class WebsiteBackendApplication {
	public static void main(String[] args) {
		 // SpringApplication.run(WebsiteBackendApplication.class, args);

		
		//https://www.mongodb.com/docs/drivers/java/sync/current/crud/insert/
		// String connectionString = "mongodb://localhost:27017/";
		// try (MongoClient mongoClient = MongoClients.create(connectionString)) {
		// 	System.out.println("=> Connection successful : ");
		// 	MongoDatabase theUsers = mongoClient.getDatabase("Life360");
		// 	MongoCollection<Document> userPublic = theUsers.getCollection("userPublic");
		// 	System.out.println(userPublic.insertOne(new Document("test", "three").append("moreTest", "two")));
		// }
		MathService math = new MathService();
		boolean verified = math.verifyJWTSignature("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiNTI1NDk5ODU5MjF9.tYoDsfVnUo7koyVeELrdi_b-EF7GyJWuZ4SmBEf_cMI=");
		System.out.println(verified);
	}

}
