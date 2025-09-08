import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { Route, Routes, BrowserRouter, Link } from "react-router";
import QR_Page from "./QR-Page";
import Map from "./Map";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Transition from "./components/Transition";
import IntroAnimation from "./components/IntroAnimation";
import AccountCreation from "./pages/accountCreation/AccountCreation";
import DisplayQR from "./pages/display-qr/DisplayQR";

function App() {
  return (
    <>
      <div className="w-screen h-screen ">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IntroAnimation />} />
            <Route
              path="/home"
              element={<Transition page={<Home />} initialState={true} />}
            />
            <Route
              path="/login"
              element={<Transition page={<Login />} initialState={false} />}
            />
            <Route
              path="/map"
              element={<Transition page={<Map />} initialState={false} />}
            />

            <Route path="/auth" element={<QR_Page />} />
            <Route
              path="/create-account"
              element={
                <Transition page={<AccountCreation />} initialState={false} />
              }
            />
            <Route
              path="/display-qr"
              element={<Transition page={<DisplayQR />} initialState={false} />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
