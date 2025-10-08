package com.example.website_backend;

import org.bson.json.JsonWriterSettings;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.website_backend.models.UserFetchRequestModel;
import com.example.website_backend.services.DatabaseService;
import com.example.website_backend.services.WebService;

@SpringBootApplication
public class WebsiteBackendApplication {
	public static void main(String[] args) {
		 
		
		//https://www.mongodb.com/docs/drivers/java/sync/current/crud/insert/
		// String connectionString = "mongodb://localhost:27017/";
		// try (MongoClient mongoClient = MongoClients.create(connectionString)) {
		// 	System.out.println("=> Connection successful : ");
		// 	MongoDatabase theUsers = mongoClient.getDatabase("Life360");
		// 	MongoCollection<Document> userPublic = theUsers.getCollection("currentLocation");
		// 	UserExposed user = new UserExposed(1, 210, 110, 0, System.currentTimeMillis());
		// 	Bson filter = Filters.eq("user_id", user.getUser_id());
		// 	userPublic.updateOne(filter, new Document("$set", user.getDocument()), new UpdateOptions().upsert(true));
		// 	// System.out.println(userPublic.insertOne(new Document("test", "three").append("moreTest", "two")));
		// 	// FindIterable<Document> item = userPublic.find(new Document("username", "Bob"));
		// 	// int id = (int) item.first().get("user_id");
		// 	// System.out.println(id);
		// } catch (Exception e) {
		// 	System.out.println(e);
		// }
		// MathService math = new MathService();
		// boolean verified = math.verifyJWTSignature("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiNTI1NDk5ODU5MjF9.tYoDsfVnUo7koyVeELrdi_b-EF7GyJWuZ4SmBEf_cMI=");
		// System.out.println(verified);
		DatabaseService service = new DatabaseService();
		WebService webService = new WebService();
		var x = service.getLocation(1);
		UserFetchRequestModel model = new UserFetchRequestModel(1, "ADMIN", new int[] {1,2,3});
		System.out.println(webService.parseRequest(model));
		System.out.println(x.toJson(JsonWriterSettings
                    .builder()
                    .build()));
		// SpringApplication.run(WebsiteBackendApplication.class, args);
	}

}
