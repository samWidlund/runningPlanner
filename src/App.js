import React, { useState } from "react";
import { GoogleMap, useLoadScript, DirectionsRenderer } from "@react-google-maps/api";
import { setDefaults, fromAddress } from "react-geocode";

// apiKey defined in .env
const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
if (!apiKey) console.error("Google Maps API Key is missing!");

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

setDefaults({
  key: apiKey,
  language: "sv",
  region: "se",
});

const App = () => {
  const [center, setCenter] = useState({ lat: 59.8586, lng: 17.6389 }); // Uppsala
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const fetchCoordinates = async (address) => {
    try {
      const { results } = await fromAddress(address);
      return results[0].geometry.location;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  const calculateRoute = async () => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API is not loaded.");
      return;
    }

    const originCoords = await fetchCoordinates(origin);
    const destinationCoords = await fetchCoordinates(destination);

    if (!originCoords || !destinationCoords) {
      console.error("Invalid addresses");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: originCoords,
        destination: destinationCoords,
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirectionsResponse(result);
          setCenter(originCoords);

          const routeDistance = result.routes[0].legs[0].distance.text;
          setDistance(routeDistance);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };

  if (!isLoaded) return <div>Laddar karta...</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="Startplats"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
      />
      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <button onClick={calculateRoute}>Beräkna rutt</button>
      <p>Distance: {distance}</p>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={center}>
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      </GoogleMap>
    </div>
  );
};

export default App;
