package com.example.website_backend.repositories;

import com.example.website_backend.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface WebRepository extends MongoRepository<User,String> {
    User findByUsername(String username);
    //https://www.mongodb.com/developer/languages/java/java-setup-crud-operations/
    @Query(value = "{}", fields = "{ '_id': 1 }")
    List<String> findAllIds();

}
