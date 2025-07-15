package com.example.website_backend.repositories;

import com.example.website_backend.dto.LocationUpdate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface LocationRepository extends MongoRepository<LocationUpdate,String> {
    @Query(value = "{ }", sort = "{ 'fieldName' : -1 }")
    List<LocationUpdate> findTopByOrderByTstDesc(Pageable pageable);
}
