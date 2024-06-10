"use client";

import React, { useState } from "react";
import { AdvancedMarker, Map, Marker, Pin } from "@vis.gl/react-google-maps";
import { MAP_VALUES } from "@/lib/constants";
import { PinIcon, Pizza, PizzaIcon, Utensils, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RestaurantsMap({ restaurants }) {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [boxContent, setBoxContent] = useState("");

  return (
    <div className="w-full relative">
      <Map
        style={{ width: "100%", height: "35vh" }}
        defaultCenter={{
          lat: MAP_VALUES.TORONTO.LAT,
          lng: MAP_VALUES.TORONTO.LNG,
        }}
        defaultZoom={MAP_VALUES.ZOOM_LEVEL}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapId={MAP_VALUES.FOOD_MAP_ID}
      >
        {restaurants.map((restaurant) => (
          <AdvancedMarker
            key={restaurant.name}
            position={{ lat: restaurant.lat, lng: restaurant.lng }}
            onClick={() => {
              setBoxContent(restaurant.name);
              setIsBoxOpen(true);
            }}
          >
            <Pin
              background={restaurant.visited ? "#16a34a" : undefined}
              glyphColor={restaurant.visited ? "#3f6212" : undefined}
              borderColor={restaurant.visited ? "#3f6212" : undefined}
            >
              <Utensils color="black" size={16} />
            </Pin>
          </AdvancedMarker>
          // <Marker
          //   key={restaurant.name}
          //   position={{ lat: restaurant.lat, lng: restaurant.lng }}
          //   onClick={() => {
          //     setBoxContent(restaurant.name);
          //     setIsBoxOpen(true);
          //   }}
          // />
        ))}
      </Map>
      {/* On-click tooltip to view the restaurant name */}
      <div
        className={cn(
          "bg-custom-accent top-4 left-4 p-2 font-md font-semibold text-custom-background rounded-md",
          isBoxOpen ? " absolute" : "hidden"
        )}
      >
        <div
          className="absolute right-[-7px] top-[-10px] cursor-pointer rounded-full bg-custom-background text-custom-text"
          onClick={() => {
            setIsBoxOpen(false);
            setBoxContent("");
          }}
        >
          <X size={16} />
        </div>
        {boxContent}
      </div>

      {/* MAP LEGEND */}
      <div className="absolute bg-custom-accent right-4 top-4 font-sm md:font-md font-semibold text-custom-background rounded-md p-2">
        Legend:
        <div className="flex flex-col gap-1 md:gap-2">
          <div className="flex flex-row mt-1 gap-1">
            <div className="w-6 h-6 rounded-md bg-[#16a34a]" />
            <div className="flex flex-col justify-center">{`= visited`}</div>
          </div>
          <div className="flex flex-row mt-1 gap-1">
            <div className="w-6 h-6 rounded-md bg-[#D85140]" />
            <div className="flex flex-col justify-center">{`= not visited`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
