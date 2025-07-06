package com.example.website_backend.models;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Document(collection = "users")
@Getter
@Setter
@ToString
public class User {
    @Id
    private String id;
    private int user_id;
    private String username;
    private String[] usersThatCanWatch;
    private String[] usersToWatch;
    private double[] currentLocation;
    private ArrayList<double[]> path;
    private ArrayList<double[]> pins;
}
