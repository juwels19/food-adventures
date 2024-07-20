"use client";

import React from "react";
import { Map, Marker } from "@vis.gl/react-google-maps";
import { MAP_VALUES } from "@/lib/constants";

export default function SingleLocationMap({ location }) {
  const lat = location?.geometry.location.lat();
  const lng = location?.geometry.location.lng();
  return (
    <Map
      // style={{ width: "100%", height: "35vh" }}
      className="w-full h-[20vh] md:h-[30vh]"
      defaultCenter={{
        lat: MAP_VALUES.TORONTO.LAT,
        lng: MAP_VALUES.TORONTO.LNG,
      }}
      center={location && { lat, lng }}
      defaultZoom={MAP_VALUES.ZOOM_LEVEL}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
      mapId={MAP_VALUES.FOOD_MAP_ID}
    >
      {lat && lng && <Marker position={{ lat, lng }} />}
    </Map>
  );
}
