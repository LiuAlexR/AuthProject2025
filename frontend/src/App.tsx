import { useState } from "react";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { Route, Routes, BrowserRouter, Link } from "react-router";
import QR_Page from "./QR-Page";

function Map() {
  const [latitute, setLatitude] = useState(-0.09);

  return (
    <>
      <div>
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, latitute]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="card">
        <button onClick={() => setLatitude((latitute) => latitute + 0.00001)}>
          latitute is {latitute}
        </button>
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/auth">Auth</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Map />} />
          <Route path="/auth" element={<QR_Page />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
