package com.example.website_backend.repositories;

import com.example.website_backend.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface WebRepository extends MongoRepository<User,String> {
    User findByUsername(String username);
    //https://www.mongodb.com/developer/languages/java/java-setup-crud-operations/
}
