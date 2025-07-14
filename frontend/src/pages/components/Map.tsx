import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

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