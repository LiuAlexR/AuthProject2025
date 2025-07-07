package com.example.website_backend;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;

import org.bson.json.JsonWriterSettings;

import java.util.ArrayList;

import java.util.List;

//@SpringBootApplication
public class WebsiteBackendApplication {
	public static void main(String[] args) {
		// SpringApplication.run(WebsiteBackendApplication.class, args);
		String connectionString = "mongodb://localhost:27017/";
		try (MongoClient mongoClient = MongoClients.create(connectionString)) {
			System.out.println("=> Connection successful : ");
			MongoDatabase theUsers = mongoClient.getDatabase("Life360");
			MongoCollection<Document> userPublic = theUsers.getCollection("userPublic");
			System.out.println(userPublic.find().first().toJson());
		}
	}

}
