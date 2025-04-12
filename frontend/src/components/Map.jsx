import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// Map container style to fill its parent
const containerStyle = {
  width: "100%",
  height: "100%",
};

const Map = ({ lat, lng }) => {
    // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Parse lat/lng as numbers for map center
  const center = { lat: parseFloat(lat), lng: parseFloat(lng) };

  // Display map once loaded
  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
      <Marker position={center} />
    </GoogleMap>
  ) : (
    <div className="text-center text-sm text-gray-400">Loading map...</div>
  );
};

export default React.memo(Map);
