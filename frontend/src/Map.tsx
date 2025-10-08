import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "./App.css";
import { JavaServer } from "./Technicals";
interface LocationUpdate {
  _type: string;
  tid: string;
  lat: number;
  lon: number;
  tst: number;
  acc: number;
  alt: number;
  vel: number;
  batt: number;
}

export default function Map() {
  const [lastLatitude, setLastLatitude] = useState(-0.09);
  const [lastLongitude, setLastLongitude] = useState<number>(51.505);
  let position: LatLngExpression = [lastLatitude, lastLongitude];

  const getRealTimeData = async () => {
    const URI: string[] = [];
    URI.push(JavaServer.PORT);
    URI.push(JavaServer.WEB_SERVER);
    URI.push(JavaServer.GET_LOCATION);

    try {
      const response = await fetch(URI.join(""));
      const data: LocationUpdate[] = await response.json();
      console.log(data);

      if (lastLatitude == data[9].lat && lastLongitude == data[9].lon) {
        setMoving(false);
        return;
      }
      setMoving(true);

      for (let i = 0; i < data.length; i++) {
        // position[0] = data[i].lat;
        // position[1] = data[i].lon;
        position[0] = 100;
        position[1] = 100;
        console.log("Iteration: " + i);
        new Promise((resolve) => setTimeout(resolve, 500));
      }

      setLastLatitude(data[9].lat);
      setLastLongitude(data[9].lon);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const UpdateMarker = () => {
    return (
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    );
  };

  const [moving, setMoving] = useState<boolean>(false);

  useEffect(() => {
    if (moving) {
      const interval = setInterval(() => {
        getRealTimeData();
        console.log("AFTER 2 sec");
      }, 2000);
      return () => clearInterval(interval);
    } else {
      const interval = setInterval(() => {
        getRealTimeData();
        console.log("After 5 s");
      }, 5000);
      return () => clearInterval(interval);
    }
  });

  interface UpdateMapProps {
    lat: number;
    long: number;
  }

  function UpdateMap({ lat, long }: UpdateMapProps) {
    const map = useMap();

    useEffect(() => {
      map.setView([lat, long]);
    }, [map, lat, long]);
    return null;
  }

  return (
    <>
      <div>
        <MapContainer
          center={[lastLatitude, lastLongitude]}
          zoom={13}
          scrollWheelZoom={true}
        >
          <UpdateMap lat={lastLatitude} long={lastLongitude} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <UpdateMarker />
        </MapContainer>
      </div>
      <div className="card">
        <button
          onClick={() =>
            setLastLatitude((lastLatitude) => lastLatitude + 0.00001)
          }
        >
          lastLatitude is {lastLatitude}
        </button>

        <button onClick={getRealTimeData}>Longitude is {lastLongitude}</button>
      </div>
    </>
  );
}
