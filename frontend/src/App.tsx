import "./App.css";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { Route, Routes, BrowserRouter, Link } from "react-router";
import QR_Page from "./QR-Page";
import Map from "./Map";

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
