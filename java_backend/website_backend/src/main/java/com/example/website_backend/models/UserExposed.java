package com.example.website_backend.models;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class UserExposed {
    private int user_id;
    private double latitude;
    private double longitude;
    private double altitude;
    private long timeOfEventMS;
    public UserExposed(int user_id, double latitude, double longitude, double altitude, long timeOfEventMS) {
        this.user_id = user_id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.timeOfEventMS = timeOfEventMS;
    }
    public int getUser_id() {
        return user_id;
    }
    public double getAltitude() {
        return altitude;
    }
    public void setAltitude(double altitude) {
        this.altitude = altitude;
    }
    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }
    public double getLatitude() {
        return latitude;
    }
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }
    public double getLongitude() {
        return longitude;
    }
    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
    public long getTimeOfEventMS() {
        return timeOfEventMS;
    }
    public String getTimeOfEventString() {
        String pattern = "MM/dd/yyyy HH:mm:ss";
        DateFormat df = new SimpleDateFormat(pattern);
        String todayAsString = df.format(new Date(timeOfEventMS));
        return todayAsString;
    }
    public void setDatetime(long timeOfEventMS) {
        this.timeOfEventMS = timeOfEventMS;
    }
}
