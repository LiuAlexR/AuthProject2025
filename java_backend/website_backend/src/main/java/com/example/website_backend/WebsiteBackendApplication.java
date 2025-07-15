package com.example.website_backend;

import com.example.website_backend.services.MathService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WebsiteBackendApplication {
	public static void main(String[] args) {
		 SpringApplication.run(WebsiteBackendApplication.class, args);

		
		//https://www.mongodb.com/docs/drivers/java/sync/current/crud/insert/
		// String connectionString = "mongodb://localhost:27017/";
		// try (MongoClient mongoClient = MongoClients.create(connectionString)) {
		// 	System.out.println("=> Connection successful : ");
		// 	MongoDatabase theUsers = mongoClient.getDatabase("Life360");
		// 	MongoCollection<Document> userPublic = theUsers.getCollection("userPublic");
		// 	System.out.println(userPublic.insertOne(new Document("test", "three").append("moreTest", "two")));
		// }
//		MathService math = new MathService();
//		boolean verified = math.verifyJWTSignature("eyJhbGciOiJIUzI1NiIsI5cCI6IkpXVCJ9.eyJleHBpcmUiOjExMTF9.J3KwXRrTHuOEkX0bXWRtLJwBnBpNQNqSnioeIMYt-aE=");
//		System.out.println(verified);
	}

}
