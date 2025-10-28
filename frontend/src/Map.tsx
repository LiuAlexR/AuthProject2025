import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
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
  const position: LatLngExpression = [lastLatitude, lastLongitude];
  const [ids, setIds] = useState<string[]>([]);
  const [moving, setMoving] = useState<boolean>(false);

  const getId = async () => {
    try {
      const CONN: string =
        JavaServer.PORT + JavaServer.WEB_SERVER + JavaServer.GET_ALL_IDS;

      const response = await fetch(CONN, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: string[] = await response.json();
      setIds(data);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    getId();
  }, []);

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
          <div className="text-sm">
            <p className="font-semibold text-gray-800">Current Location</p>
            <p className="text-gray-600 text-xs mt-1">
              {lastLatitude.toFixed(6)}, {lastLongitude.toFixed(6)}
            </p>
          </div>
        </Popup>
      </Marker>
    );
  };

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

  const print = () => {
    console.log(ids);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative z-10 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Location Tracker
                </h1>
                <p className="text-xs text-purple-200">Real-time monitoring</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {moving && (
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm font-medium shadow-lg shadow-green-500/50 animate-pulse">
                  Moving
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="h-[600px] relative">
                <MapContainer
                  center={[lastLatitude, lastLongitude]}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="h-full w-full"
                  style={{ background: "#1e293b" }}
                >
                  <UpdateMap lat={lastLatitude} long={lastLongitude} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <UpdateMarker />
                </MapContainer>

                {/* Map Overlay Stats */}
                <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
                  <div className="backdrop-blur-xl bg-white/90 rounded-xl px-4 py-3 shadow-lg border border-white/50">
                    <div className="text-xs text-gray-500 font-medium mb-1">
                      Latitude
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {lastLatitude.toFixed(6)}
                    </div>
                  </div>
                  <div className="backdrop-blur-xl bg-white/90 rounded-xl px-4 py-3 shadow-lg border border-white/50">
                    <div className="text-xs text-gray-500 font-medium mb-1">
                      Longitude
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {lastLongitude.toFixed(6)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Controls */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Controls
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() =>
                    setLastLatitude((lastLatitude) => lastLatitude + 0.00001)
                  }
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/60"
                >
                  <span className="text-sm">
                    lastLatitude is {lastLatitude}
                  </span>
                </button>

                <button
                  onClick={getRealTimeData}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/60"
                >
                  <span className="text-sm">Longitude is {lastLongitude}</span>
                </button>

                <button
                  onClick={print}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium shadow-lg shadow-emerald-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/60"
                >
                  <span className="text-sm">Hello World</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Statistics
              </h2>

              <div className="space-y-3">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-xs text-purple-200 mb-1">
                    Tracked Devices
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {ids.length}
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-xs text-purple-200 mb-1">
                    Update Interval
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {moving ? "2s" : "5s"}
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-xs text-purple-200 mb-1">Status</div>
                  <div className="text-2xl font-bold text-white capitalize">
                    {moving ? "🚀 Active" : "⏸️ Idle"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
