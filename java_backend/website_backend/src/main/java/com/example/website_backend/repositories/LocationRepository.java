package com.example.website_backend.repositories;

import com.example.website_backend.dto.LocationUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LocationRepository extends MongoRepository<LocationUpdate,String> {
}
