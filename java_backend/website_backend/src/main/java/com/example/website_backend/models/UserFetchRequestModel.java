package com.example.website_backend.models;
public class UserFetchRequestModel {
    private int user_id;
    private String jwt;
    int[] fetchableIDs;

    public UserFetchRequestModel(int user_id, String jwt, int[] fetchableIDs) {
        this.user_id = user_id;
        this.jwt = jwt;
        this.fetchableIDs = fetchableIDs;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public int[] getFetchableIDs() {
        return fetchableIDs;
    }

    public void setFetchableIDs(int[] fetchableIDs) {
        this.fetchableIDs = fetchableIDs;
    }
    
}
