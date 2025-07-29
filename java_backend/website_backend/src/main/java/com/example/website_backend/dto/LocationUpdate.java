package com.example.website_backend.dto;

import com.example.website_backend.models.UserExposed;

public class LocationUpdate {
    public String _type;
    public String tid;
    public double lat;
    public double lon;
    public long tst;
    public double acc;
    public double alt;
    public double vel;
    public int batt;
    public  UserExposed toUserExposed() {
        return new UserExposed(0, lat, lon, alt, 0);
    }
}
