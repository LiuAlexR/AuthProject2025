import { useState } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { Route, Routes, BrowserRouter, Link } from "react-router";
import QR_Page from "./QR-Page";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<QR_Page />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
