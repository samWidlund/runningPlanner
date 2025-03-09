import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoBox, InfoWindow } from '@react-google-maps/api';
import {
  setDefaults,
  fromAddress,
  fromLatLng,
  fromPlaceId,
  setLocationType,
  geocode,
  RequestType,
} from "react-geocode";

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
if (!apiKey) {
  console.error("Google Maps API Key is missing!");
}

setDefaults({
  key: apiKey, 
  language: "sv",
  region: "se",
});

const App = () => {
  const [center, setCenter] = useState({
    lat: 59.87240559999999,
    lng: 17.887085,
  })

  const [inputValue, setInputValue] = useState('');
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  function inputLocation(location) {
    fetchCordinates(location).then(({ lat, lng }) => setCenter( {lat, lng}));
    
    // return value?
  }

  async function fetchCordinates(location) { 
    try {
      const { results } = await fromAddress(location);
      const { lat, lng } = results[0].geometry.location;

      return ( {lat, lng} );
      } catch(error) {
      console.error(error);
    }
  }
  useEffect(() => { 
    fetchCordinates("Stockholm").then(({ lat, lng }) => console.log("coordinates:", { lat, lng }));
    fetchCordinates("Umeå").then(({ lat, lng }) => setCenter( {lat, lng}));
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey
  });
  if (loadError) {return <div>Error loading maps</div>;}
  if (!isLoaded) {return <div>Loading maps</div>;}

  return (
    <div>
      <button onClick={() => fetchCordinates("Åre")}>
        Byt till Åre
      </button>
      <button onClick={() => fetchCordinates("Uppsala")}>
        Byt till Uppsala
      </button>

      <input type="text" placeholder="location" value={inputValue} onChange={handleChange} />
      <button onClick={inputLocation}>Insert</button>
      <p>Current Input Value: {inputValue}</p>
      
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default App;